const mongoose = require("mongoose");

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

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;