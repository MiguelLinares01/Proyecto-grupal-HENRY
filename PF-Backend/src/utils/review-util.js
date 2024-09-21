const { User } = require('../db')

const reviewInclude = [
	{
		model: User,
		as: 'reviewer',
		attributes: ['id', 'userName', 'email'],
	},
	{
		model: User,
		as: 'reviewedUser',
		attributes: ['id', 'userName', 'email'],
	},
]

module.exports = {
    reviewInclude
}