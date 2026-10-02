function isValidMoneyAmount(amount) {
    if (typeof amount === "number") {
        return Number.isFinite(amount)
            && amount > 0
            && Math.round(amount * 100) === amount * 100
    }

    if (typeof amount === "string") {
        const trimmed = amount.trim()

        if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
            return false
        }

        const numericAmount = Number(trimmed)

        return Number.isFinite(numericAmount) && numericAmount > 0
    }

    return false
}

module.exports = isValidMoneyAmount