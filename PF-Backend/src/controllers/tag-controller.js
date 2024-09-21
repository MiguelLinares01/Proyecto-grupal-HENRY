const { Op } = require('sequelize')
const { Tag } = require('../db')

const getAllTagsController = async (name) => {
	try {
		let where = {}
		if (name) {
			where = {
				name: { [Op.iLike]: `%${name}%` },
			}
		}
		const allTags = await Tag.findAll({ where })
		return allTags
	} catch (error) {
		throw new Error('Tags not found')
	}
}

const findOrCreateTags = async (tags) => {
	return Promise.all(
		tags.map(async (tagName) => {
			const [tag] = await Tag.findOrCreate({
				where: { tagName },
			})
			return tag
		})
	)
}

module.exports = {
	getAllTagsController,
	findOrCreateTags,
}
