const {
	User,
	Project,
	Technology,
	Tag,
	Contract,
	Plan,
	Link,
	Review,
	Commission,
} = require('../db')
const { Op } = require('sequelize')

const getUserIncludes = (queries = {}) => {
	let includes = [
		{
			model: Project,
			as: 'projects',
			include: [
				{
					model: Technology,
					as: 'technologies',
				},
				{
					model: Tag,
					as: 'tags',
					order: [['tagName', 'ASC']],
				},
			],
		},
		{
			model: Contract,
			as: 'sentContracts',
			include: [
				{
					model: Commission,
					as: 'commission',
				},
				{
					model: User,
					as: 'receiver',
					attributes: ['id', 'userName', 'planName'],
				},
			],
		},
		{
			model: Contract,
			as: 'receivedContracts',
			include: [
				{
					model: Commission,
					as: 'commission',
				},
				{
					model: User,
					as: 'receiver',
					attributes: ['id', 'userName', 'email', 'planName']
				},
				{
					model: User,
					as: 'sender',
					attributes: ['id', 'userName', 'planName'],
				},
			],
		},
		{
			model: Plan,
			as: 'plan',
		},
		{
			model: Link,
			as: 'links',
		},
		{
			model: Review,
			as: 'reviewsReceived',
			include: [
				{
					model: User,
					as: 'reviewer',
					attributes: ['id', 'userName', 'image', 'planName'],
				},
				{
					model: User,
					as: 'reviewedUser',
					attributes: ['id', 'userName', 'image', 'planName'],
				},
			],
		},
	]

	if (queries.exclude) {
		const excludeModels = queries.exclude.split(',')
		includes = includes.filter((include) => !excludeModels.includes(include.as))
	}

	if (queries.technologies) {
		const technologyInclude = includes.find((include) => include.as === 'technologies')
		if (technologyInclude) {
			technologyInclude.where = { name: { [Op.in]: queries.technologies.split(',') } }
		}
	}

	if (queries.tags) {
		const tagInclude = includes.find((include) => include.as === 'tags')
		if (tagInclude) {
			tagInclude.where = { tagName: { [Op.iLike]: `%${queries.tags.split(',').join('%')}%` } }
		}
	}

	return includes
}

const getUserOrder = (queries) => {
	switch (queries.sort) {
		case 'a-z':
			return [['userName', 'ASC']]
		case 'z-a':
			return [['userName', 'DESC']]
		default:
			return []
	}
}

const getWhereCondition = ({ search }) => {
	let where = { deletedAt: null }

	if (search) {
		where[Op.or] = [
			{ userName: { [Op.iLike]: `%${search}%` } },
			{ email: { [Op.iLike]: `%${search}%` } },
		]
	}

	return where
}

const getPagination = async ({ page = 1, pageSize = 10 }, currentUser) => {
	const offset = (page - 1) * parseInt(pageSize, 10)
	let limit = parseInt(pageSize, 10)
	if (currentUser) {
		try {
			const user = await User.findByPk(currentUser.id, {
				include: [{ model: Plan, as: 'plan' }],
			})

			if (user) {
				if (user.dataValues.planName === 'Free') {
					limit = 10
				}
			} else return
		} catch (error) {
			console.error('Error fetching user data:', error)
			limit = 10
		}
	} else {
		limit = 10
	}

	return { offset, limit }
}

module.exports = {
	getUserIncludes,
	getUserOrder,
	getWhereCondition,
	getPagination,
}
