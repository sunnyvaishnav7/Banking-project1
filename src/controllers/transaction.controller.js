const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")
const isValidMoneyAmount = require("../utils/money")

function createRequestError(message, statusCode) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

function respondToExistingTransaction(transaction, expected, res) {
    if (!transaction) {
        return false
    }

    const matchesRequest = String(transaction.fromAccount) === String(expected.fromAccount)
        && String(transaction.toAccount) === String(expected.toAccount)
        && transaction.amount === expected.amount

    if (!matchesRequest) {
        res.status(409).json({ message: "Idempotency key has already been used for a different request" })
    } else if (transaction.status === "COMPLETED") {
        res.status(200).json({ message: "Transaction already processed", transaction })
    } else {
        res.status(409).json({ message: `Transaction cannot be retried while its status is ${transaction.status}` })
    }

    return true
}

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || amount === undefined || !idempotencyKey) {
        return res.status(400).json({ message: "FromAccount, toAccount, amount and idempotencyKey are required" })
    }
    if (!mongoose.isValidObjectId(fromAccount) || !mongoose.isValidObjectId(toAccount)) {
        return res.status(400).json({ message: "Invalid fromAccount or toAccount" })
    }
    if (!isValidMoneyAmount(amount)) {
        return res.status(400).json({ message: "amount must be a positive number with at most two decimal places" })
    }
    if (typeof idempotencyKey !== "string" || !idempotencyKey.trim() || idempotencyKey.length > 128) {
        return res.status(400).json({ message: "idempotencyKey must be a non-empty string of at most 128 characters" })
    }
    if (String(fromAccount) === String(toAccount)) {
        return res.status(400).json({ message: "Source and destination accounts must be different" })
    }

    const sender = await accountModel.findOne({ _id: fromAccount, user: req.user._id, status: "ACTIVE" })
    if (!sender) {
        return res.status(404).json({ message: "Active source account not found" })
    }

    const expectedTransaction = {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey: idempotencyKey.trim()
    }
    const priorTransaction = await transactionModel.findOne({ idempotencyKey: expectedTransaction.idempotencyKey })
    if (respondToExistingTransaction(priorTransaction, expectedTransaction, res)) {
        return
    }

    const destination = await accountModel.findOne({ _id: toAccount, status: "ACTIVE" })
    if (!destination) {
        return res.status(404).json({ message: "Active destination account not found" })
    }
    if (sender.currency !== destination.currency) {
        return res.status(400).json({ message: "Source and destination accounts must use the same currency" })
    }

    const session = await mongoose.startSession()
    let transaction
    try {
        await session.withTransaction(async () => {
            const serializedSender = await accountModel.findOneAndUpdate(
                { _id: fromAccount, user: req.user._id, status: "ACTIVE" },
                { $inc: { balanceVersion: 1 } },
                { new: true, session }
            )
            if (!serializedSender) {
                throw createRequestError("Active source account not found", 404)
            }

            const currentBalance = await serializedSender.getBalance(session)
            if (currentBalance < amount) {
                throw createRequestError(`Insufficient balance. Current balance is ${currentBalance}. Requested amount is ${amount}`, 400)
            }

            const activeDestination = await accountModel.findOne({ _id: toAccount, status: "ACTIVE" }).session(session)
            if (!activeDestination) {
                throw createRequestError("Active destination account not found", 404)
            }
            if (serializedSender.currency !== activeDestination.currency) {
                throw createRequestError("Source and destination accounts must use the same currency", 400)
            }

            transaction = new transactionModel({ ...expectedTransaction, status: "PENDING" })
            await transaction.save({ session })
            await ledgerModel.create([
                { account: fromAccount, amount, transaction: transaction._id, type: "DEBIT" },
                { account: toAccount, amount, transaction: transaction._id, type: "CREDIT" }
            ], { session })
            transaction.status = "COMPLETED"
            await transaction.save({ session })
        })
    } catch (error) {
        if (error.code === 11000) {
            const existing = await transactionModel.findOne({ idempotencyKey: expectedTransaction.idempotencyKey })
            if (respondToExistingTransaction(existing, expectedTransaction, res)) return
        }
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Transfer failed. No changes were committed."
        })
    } finally {
        await session.endSession()
    }

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    return res.status(201).json({ message: "Transaction completed successfully", transaction })
}

async function getTransactionHistory(req, res) {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10))
    const accounts = await accountModel.find({ user: req.user._id }).select("_id").lean()
    const accountIds = accounts.map((account) => account._id)

    if (accountIds.length === 0) {
        return res.status(200).json({ transactions: [], page, limit, total: 0, pages: 0 })
    }

    const filter = {
        $or: [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ]
    }
    const [transactions, total] = await Promise.all([
        transactionModel.find(filter)
            .select("fromAccount toAccount amount status createdAt")
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        transactionModel.countDocuments(filter)
    ])
    const ownedAccounts = new Set(accountIds.map(String))

    return res.status(200).json({
        transactions: transactions.map((transaction) => ({
            ...transaction,
            direction: ownedAccounts.has(String(transaction.fromAccount)) ? "OUTGOING" : "INCOMING"
        })),
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    })
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })


}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}
