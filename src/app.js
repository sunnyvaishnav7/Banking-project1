const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");


//Routes section 
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")

//User Routes Section
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRouter)

module.exports = app;