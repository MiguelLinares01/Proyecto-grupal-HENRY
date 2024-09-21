const { User } = require('../db')

const checkPremium = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.id)
		if (user.planName !== 'Premium') {
			return res.status(403).json({ message: 'Only Premium users can leave a review.' })
		}
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = { checkPremium }
