const { User, Plan } = require('../db')
const { fn, col } = require('sequelize')

const averagePrice = async () => {
	try {
		const result = await User.findAll({
			attributes: [[fn('AVG', col('plan.price')), 'averagePrice']],
			include: [
				{
					model: Plan,
					as: 'plan',
					attributes: [],
				},
			],
			where: {
				role: 'user',
			},
			raw: true,
		})
		const averagePrice = result[0].averagePrice
		const roundedAveragePrice = averagePrice ? parseFloat(averagePrice).toFixed(2) : null
		return roundedAveragePrice
	} catch (error) {
		console.log('Error al calcular el promedio del precio:', error)
		return null
	}
}

module.exports = averagePrice
