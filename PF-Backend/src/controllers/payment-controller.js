const { User, Plan } = require('../db')
const mercadopago = require('mercadopago')
const youArePremium = require('../mailer/newPremium')
const stripe = require('stripe')
const {
	MP_TEST_ACCESS_TOKEN,
	FRONT_DEPLOY,
	FRONT_LOCAL_SUCCESS,
	FRONT_LOCAL_FAILURE,
	FRONT_LOCAL_PENDING,
} = process.env

const client = new mercadopago.MercadoPagoConfig({
	accessToken: MP_TEST_ACCESS_TOKEN,
})

const clientStripe = new stripe(
	'sk_test_51PfcjxApzRY4HXw3SaIcmqMxh742spkGCG0ne5zCdsJATcsRky6mzglZe5n7lsGXzGZF6YAee3smMVgx8f8MdAcq00jf92UHM2'
)

const stripeSession = require('stripe')(
	'sk_test_51PfcjxApzRY4HXw3SaIcmqMxh742spkGCG0ne5zCdsJATcsRky6mzglZe5n7lsGXzGZF6YAee3smMVgx8f8MdAcq00jf92UHM2'
)

const createPreference = async (title, quantity, unit_price, user) => {
	try {
		if (!user.id) {
			return res.status(400).json({ message: 'User not found' })
		}
		const body = {
			items: [
				{
					title: title,
					quantity: Number(quantity),
					unit_price: Number(unit_price),
					currency_id: 'ARS',
				},
			],
			back_urls: {
				success: FRONT_LOCAL_SUCCESS,
				failure: FRONT_LOCAL_FAILURE,
				pending: FRONT_LOCAL_PENDING,
			},
			external_reference: user.id,
		}
		const preference = new mercadopago.Preference(client)
		const result = await preference.create({ body })
		console.log(result.sandbox_init_point)
		return result.id
	} catch (error) {
		console.error('Error creating preference:', error)
		throw error
	}
}

const paymentNotificationController = async (payment) => {
	try {
		if (payment.type === 'payment' && payment.data.status === 'approved') {
			const userId = payment.data.external_reference
			const user = await User.findByPk(userId)
			const premiumPlan = await Plan.findOne({ where: { planName: 'Premium' } })
			if (!user) throw new Error('User not found')
			user.planName = premiumPlan.planName
			await user.save()
			await youArePremium(payment)
			return 'User updated to premium'
		}
	} catch (error) {
		throw new Error('Payment not approved or not a payment type')
	}
}

const cancelSubscriptionController = async (currentUser) => {
	try {
		const user = await User.findByPk(currentUser.id)
		if (!user) throw new Error('User not found')
		const freePlan = await Plan.findOne({ where: { planName: 'Free' } })
		if (!freePlan) throw new Error('Free plan not found')
		user.planName = freePlan.planName
		await user.save()
		return 'Subscription canceled and user updated to free plan'
	} catch (error) {
		throw error
	}
}

const createStripePreference = async (title, quantity, unit_price) => {
	const pesos = unit_price
	const centavos = pesos * 100
	const session = await clientStripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					product_data: {
						name: title,
					},
					currency: 'ARS',
					unit_amount: centavos,
				},
				quantity: quantity,
			},
		],
		mode: 'payment',
		success_url: `${process.env.FRONT_LOCAL_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: process.env.FRONT_LOCAL_FAILURE,
	})
	console.log(session)
	return session.url
}

const paymentStripeController = async (sessionId, user, email) => {
	const payment = email
	try {
		const session = await stripeSession.checkout.sessions.retrieve(sessionId)

		if (!session) {
			console.log('No session found with the provided ID.')
			return { status: 404, message: 'No session found with the provided ID.' }
		}

		const paymentIntentId = session.payment_intent

		if (paymentIntentId) {
			const paymentIntent = await stripeSession.paymentIntents.retrieve(paymentIntentId)

			if (paymentIntent.status === 'succeeded') {
				const userId = await User.findByPk(user)
				if (!userId) {
					return { status: 404, message: 'User not found.' }
				}

				const premiumPlan = await Plan.findOne({ where: { planName: 'Premium' } })
				if (!premiumPlan) {
					return { status: 404, message: 'Premium plan not found.' }
				}

				userId.planName = premiumPlan.planName
				await userId.save()
				await youArePremium(payment)
				return { status: 200, message: 'User updated to premium' }
			} else {
				return { status: 400, message: 'PaymentIntent not succeeded.' }
			}
		} else {
			return { status: 404, message: 'No PaymentIntent associated with this Checkout Session.' }
		}
	} catch (error) {
		return { status: 500, message: `Error retrieving PaymentIntent: ${error.message}` }
	}
}

//* Tarjeta visa Argentina prueba 4000000320000021 COD 123 EXP 12/26

module.exports = {
	createPreference,
	paymentNotificationController,
	createStripePreference,
	cancelSubscriptionController,
	paymentStripeController,
}
