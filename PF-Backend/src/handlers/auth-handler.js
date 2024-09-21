const {
	auth0UserController,
	loginUserController,
	registerUserController,
} = require('../controllers/auth-controller')
const welcome = require('../mailer/welcome')

const auth0User = async (req, res) => {
	try {
		const userData = req.body;
		const response = await auth0UserController(userData)
		res.status(200).json(response)
	} catch (error) {
		console.error('Token verification error:', error)
		return res.status(401).json({ message: 'Unauthorized: Invalid token' })
	}
}

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body
		const response = await loginUserController(email, password)
		return res.status(200).json(response)
	} catch (error) {
		console.error("Login error:", error)
		res.status(401).json(error)
	}
}

const registerUser = async (req, res) => {
	try {
		const { userName, email, password } = req.body
		if (!userName || !email || !password) res.status(400).send('All fields are required')
		const response = await registerUserController(userName, email, password)
		await welcome(email)
		return res.status(201).json(response)
	} catch (error) {
		console.error("Registration or email error:", error)
		res.status(500).json({ error: "Error creating a user"})
	}
}

module.exports = {
	auth0User,
	loginUser,
	registerUser,
}
