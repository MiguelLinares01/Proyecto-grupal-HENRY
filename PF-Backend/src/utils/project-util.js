const { User, Technology, Tag, Like, Plan } = require('../db')
const { Op } = require('sequelize')

const getProjectIncludes = (queries = {}) => {
	let includes = [
		{ model: User, as: 'user' },
		{
			model: Technology,
			as: 'technologies',
			through: { attributes: [] },
			required: !!queries.technologies,
		},
		{
			model: Tag,
			as: 'tags',
			through: { attributes: [] },
			required: false,
			order: [['tagName', 'ASC']],
		},
		{
			model: Like,
			as: 'likes',
			attributes: ['userId'],
			required: false,
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
			tagInclude.where = {
				tagName: { [Op.iLike]: { [Op.any]: queries.tags.split(',').map((tag) => `%${tag}%`) } },
			}
			tagInclude.required = true // Filtrar para incluir solo proyectos que coincidan con los tags
		}
	}

	return includes
}


const getProjectOrder = (queries) => {
	switch (queries.sort) {
		case 'a-z':
			return [['title', 'ASC']]
		case 'z-a':
			return [['title', 'DESC']]
		case 'new':
			return [['createdAt', 'DESC']]
		case 'old':
			return [['createdAt', 'ASC']]
		default:
			return []
	}
}

const getWhereCondition = (queries) => {
	let where = { deletedAt: null }

	if (queries.title) {
		where[Op.or] = [{ title: { [Op.iLike]: `%${queries.title}%` } }]
	}

	return where
}

const getPagination = async ({ page = 1, pageSize = 10 }, currentUser) => {
	const offset = (page - 1) * parseInt(pageSize, 10);
	let limit = parseInt(pageSize, 10);	
	if (currentUser) {
		try {
			const user = await User.findByPk(currentUser.id, {
				include: [{ model: Plan, as: 'plan' }],
			});

			if (user) {
				if (user.dataValues.role === 'admin') return 
				else if (user.dataValues.planName === 'Free') {
					limit = 20;
				}
			} else return
		} catch (error) {
			console.error('Error fetching user data:', error);
			limit = 20;
		}
	} else {
		limit = 20;
	}

	return { offset, limit };
}


module.exports = { getProjectIncludes, getProjectOrder, getWhereCondition, getPagination }
