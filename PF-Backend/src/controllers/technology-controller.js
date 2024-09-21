const { Op } = require('sequelize')
const { Technology } = require('../db')

const getAllTechnologiesController = async (name) => {
	try {
		let where = {}
		if (name) {
			where = {
				name: { [Op.iLike]: `%${name}%` },
			}
		}
		const allTechnologies = await Technology.findAll({ where })
		return allTechnologies
	} catch (error) {
		throw new Error('Technologies not found')
	}
}

const createTechnologyController = async (name) => {
	try {
		const [technology, created] = await Technology.findOrCreate({
			where: { name },
		});
		if (!created) {
			throw new Error('Technology already exists');
		}
		return technology;
	} catch (error) {
		throw new Error('Technology creation failed');
	}
};


const findOrCreateTechnologies = async (technologies) => {
	return Promise.all(
		technologies.map(async (techName) => {
			const [technology] = await Technology.findOrCreate({
				where: { name: techName },
			})
			return technology
		})
	)
}

module.exports = {
	getAllTechnologiesController,
	findOrCreateTechnologies,
	createTechnologyController
}
