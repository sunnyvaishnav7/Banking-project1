const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blackList.model")



function getRequestToken(req) {
    const authorization = req.headers.authorization
    const bearerToken = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]
    return bearerToken || req.cookies?.token
}

async function authenticate(req, res, next, requireSystemUser = false) {
    const token = getRequestToken(req)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    try {
        const isBlacklisted = await tokenBlackListModel.findOne({ token })
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized access, token is invalid"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const query = userModel.findById(decoded.userId)
        const user = await (requireSystemUser ? query.select("+systemUser") : query)

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, token is invalid"
            })
        }
        if (requireSystemUser && !user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }
        req.user = user
        req.authToken = token
        return next()
    } catch (err) {
        if (!(err instanceof jwt.JsonWebTokenError)) {
            return next(err)
        }
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

function authMiddleware(req, res, next) {
    return authenticate(req, res, next)
}

function authSystemUserMiddleware(req, res, next) {
    return authenticate(req, res, next, true)
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}