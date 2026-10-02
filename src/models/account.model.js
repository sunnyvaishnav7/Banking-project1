const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Account must be associated with a user"]
        },

        status: {
            type: String,
            enum: ["ACTIVE", "FROZEN", "CLOSED"],
            default: "ACTIVE"
        },

        currency: {
            type: String,
            required: [true, "Currency is required for creating an account"],
            default: "INR"
        },

        balanceVersion: {
            type: Number,
            default: 0,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// A user cannot have more than one account with the same status
accountSchema.index(
    { user: 1, status: 1 },
    { unique: true }
);

accountSchema.methods.getBalance = async function (session) {
    let balanceQuery = ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ]);

    if (session) {
        balanceQuery = balanceQuery.session(session);
    }

    const balanceData = await balanceQuery;

    if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
};

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;