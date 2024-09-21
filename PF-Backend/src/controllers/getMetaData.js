const { User, Plan, Link, Like, Project, Review, Contract, Commission } = require('../db')
const { fn, col, literal, Op } = require('sequelize')

const metaDateDashboard = async () => {
	try {
		const likeCount = await Like.count()

		const projectsLikes = await Project.count({
			include: [
				{
					model: Like,
					as: 'likes',
					attributes: [],
					required: true,
				},
			],
		})
		const userCount = await User.count({
			where: {
				role: {
					[Op.ne]: 'admin',
				},
			},
		})
		const userAdmin = await User.count({
			where: {
				role: 'admin',
			},
		})
		const userPremium = await User.count({
			where: {
				planName: 'Premium',
			},
		})

		const userFree = await User.count({
			where: {
				planName: 'Free',
			},
		})
		const projectsCount = await Project.count()

		const contractCount = await Contract.count()
		const contractAccepted = await Contract.count({
			where: {
				status: 'accepted',
			},
		})
		const totalCommissions = await Commission.sum('amount')

		const reviewCount = await Review.count()

		const githubCount = await Link.count({
			where: {
				name: 'GitHub',
			},
		})

		const linkedInCount = await Link.count({
			where: {
				name: 'LinkedIn',
			},
		})

		const incomeTotal = await User.findAll({
			attributes: [[fn('SUM', col('plan.price')), 'totalPrice']],
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

		const total = incomeTotal[0].totalPrice
		const sumaTotal = totalCommissions + total
		const roundedAverageTotal = sumaTotal ? parseFloat(sumaTotal).toFixed(1) : null

		const sumAdminPlans = await User.findAll({
			attributes: [[fn('SUM', col('plan.price')), 'sumPrice']],
			include: [
				{
					model: Plan,
					as: 'plan',
					attributes: [],
				},
			],
			where: {
				role: 'user',
				planName: 'Premium',
			},
			raw: true,
		})

		const sumPrice = sumAdminPlans[0].sumPrice || 0
		const averagePrice = (sumPrice + totalCommissions) / userAdmin
		const roundedAveragePrice = averagePrice ? parseFloat(averagePrice).toFixed(1) : null

		const linkedInPercentage = ((linkedInCount / projectsCount) * 100).toFixed()
		const githubPercentage = ((githubCount / userCount) * 100).toFixed()
		const reviewsPercentage = ((reviewCount / userCount) * 100).toFixed(2)
		const likesPercentage = ((projectsLikes / projectsCount) * 100).toFixed(2)

		return {
			userCount,
			userAdmin,
			userPremium,
			userFree,
			projectsCount,
			contractCount,
			contractAccepted,
			roundedAverageTotal,
			roundedAveragePrice,
			totalCommissions,
			likeCount,
			likesPercentage,
			githubCount,
			linkedInCount,
			reviewCount,
			linkedInPercentage,
			githubPercentage,
			reviewsPercentage,
		}
	} catch (error) {
		console.error('Error fetching dashboard data:', error)
		throw error
	}
}

module.exports = metaDateDashboard
