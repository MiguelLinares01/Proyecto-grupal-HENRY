const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User } = require('../db')
const { getUserIncludes } = require('../utils/user-utils')

const auth0UserController = async (userData) => {
	try {
		const { userName, email, password, image } = userData
		const hashedPassword = await bcrypt.hash(password, 10)
		const [user, created] = await User.findOrCreate({
			where: { email },
			defaults: { userName, password: hashedPassword, image },
			include: getUserIncludes(),
		})
		const accessToken = jwt.sign(
			{ id: user.id, userName: user.userName },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1h' }
		)
		return { user, token: accessToken }
	} catch (error) {
		throw error
	}
}

const loginUserController = async (email, password) => {
	try {
		const user = await User.findOne({ where: { email: email }, include: getUserIncludes() })
		if (!user) throw new Error('Invalid credentials')

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) throw new Error('Invalid credentials')

		const accessToken = jwt.sign(
			{ id: user.id, userName: user.userName, role: user.role },
			process.env.ACCESS_TOKEN_SECRET
			// { expiresIn: '1h' }
		)

		return { user, token: accessToken }
	} catch (error) {
		console.error('Error login:', error)
		throw error
	}
}

const registerUserController = async (userName, email, password) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 10)
		const [user, created] = await User.findOrCreate({
			where: { userName, email, password: hashedPassword },
		})
		if (!created) throw new Error('User already exists')
		return user
	} catch (error) {
		console.error(error)
		throw new Error('Failed to create a user')
	}
}

module.exports = {
	auth0UserController,
	loginUserController,
	registerUserController,
}
