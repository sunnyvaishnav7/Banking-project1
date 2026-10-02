const express = require("express")
const authController = require("../controllers/auth.controllers")
const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router()


/* POST /api/auth/register */
router.post("/register", authController.userRegisterController)


/* POST /api/auth/login */
router.post("/login", authController.userLoginController)

router.get("/me", authMiddleware.authMiddleware, authController.userSessionController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authMiddleware.authMiddleware, authController.userLogoutController)



module.exports = router