const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model")

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000
}

function setAuthCookie(res, token) {
    res.cookie("token", token, authCookieOptions)
}

function getPublicUser(user) {
    return {
        _id: user._id,
        email: user.email,
        name: user.name
    }
}

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string" || !email.trim() || !password || !name.trim()) {
        return res.status(400).json({
            message: "name, email and password are required"
        })
    }

    try {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedName = name.trim()
        const isExists = await userModel.findOne({ email: normalizedEmail })

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with email.",
                status: "failed"
            })
        }

        const user = await userModel.create({
            email: normalizedEmail,
            password,
            name: normalizedName
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

        setAuthCookie(res, token)

        res.status(201).json({ user: getPublicUser(user) })

        await emailService.sendRegistrationEmail(user.email, user.name)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate record found. Please use a different email. If this is an old database index issue, remove the stale username index from MongoDB."
            })
        }

        return res.status(400).json({
            message: error.message || "Registration failed"
        })
    }
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
    const { email, password } = req.body

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    setAuthCookie(res, token)

    res.status(200).json({ user: getPublicUser(user) })

}

function userSessionController(req, res) {
    return res.status(200).json({ user: getPublicUser(req.user) })
}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.authToken

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token", {
        httpOnly: authCookieOptions.httpOnly,
        secure: authCookieOptions.secure,
        sameSite: authCookieOptions.sameSite
    })

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    userSessionController
}