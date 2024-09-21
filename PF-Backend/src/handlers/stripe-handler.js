// const createStripePreference = require('../controllers/stripe-controller')
// const youArePremium = require('../mailer/newPremium')

// const { User, Plan } = require('../db')

// const stripe = require('stripe')(
// 	'sk_test_51PfcjxApzRY4HXw3SaIcmqMxh742spkGCG0ne5zCdsJATcsRky6mzglZe5n7lsGXzGZF6YAee3smMVgx8f8MdAcq00jf92UHM2'
// )

// const stripePreference = async (req, res) => {
// 	const { title, quantity, unit_price } = req.body
// 	try {
// 		const response = await createStripePreference(title, quantity, unit_price)
// 		res.status(200).json(response)
// 	} catch (error) {
// 		res.status(500).send(error.message)
// 	}
// }

// const endpointSecret = 'whsec_8fcf0119fb3518a26464486db94719914a89443ffd4c502bc5303c97622ff743'

// const stripeWebhook = async (req, res) => {
// 	const userId = '94cba057-af17-4a44-8c7e-761d6d9c6b49'
// 	console.log(user + ' log de UserID')
// 	const body = req.body
// 	console.log(body + ' log de body', body)

// 	if (body && body.data && body.data.object) {
// 		const status = body.data.object.status
// 		res.status(200).json(status)
// 		if (status === 'succeeded') {
// 			const user = await User.findByPk(user.id)
// 			const email = user.email
// 			const premiumPlan = await Plan.findOne({ where: { planName: 'Premium' } })
// 			user.planName = premiumPlan.planName
// 			await user.save()
// 			await youArePremium(email)
// 			// esperando email
// 		}
// 	} else {
// 		res.status(400).send('Bad Request: Estructura de body no esperada')
// 	}
// }

module.exports = { stripePreference, stripeWebhook }
