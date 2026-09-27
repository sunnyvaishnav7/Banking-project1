const accountModel = require("../models/account.model")

async function createAccountController(req, res) {
    try {
        const { currency = "INR" } = req.body

        const account = await accountModel.create({
            user: req.user._id,
            currency,
            status: "ACTIVE"
        })

        return res.status(201).json({
            message: "Account created successfully",
            account
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Could not create account"
        })
    }
}

async function getUserAccountsController(req, res) {
    try {
        const accounts = await accountModel.find({ user: req.user._id })

        return res.status(200).json({
            accounts
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch user accounts"
        })
    }
}

async function getAccountBalanceController(req, res) {
    try {
        const { accountId } = req.params

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })
        }

        const balance = await account.getBalance()

        return res.status(200).json({
            accountId: account._id,
            balance
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch account balance"
        })
    }
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}