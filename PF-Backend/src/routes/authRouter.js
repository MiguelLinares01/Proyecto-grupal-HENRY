const { Router } = require('express')
const { auth0User, loginUser, registerUser } = require('../handlers/auth-handler')
const authRouter = Router()

authRouter.post("/auth0", auth0User)
authRouter.post("/login", loginUser)
authRouter.post("/signup", registerUser)

module.exports = authRouter