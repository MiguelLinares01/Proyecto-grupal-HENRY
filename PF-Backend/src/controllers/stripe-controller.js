const stripe = require('stripe')

const client = new stripe(
	'sk_test_51PfcjxApzRY4HXw3SaIcmqMxh742spkGCG0ne5zCdsJATcsRky6mzglZe5n7lsGXzGZF6YAee3smMVgx8f8MdAcq00jf92UHM2'
)

const createStripePreference = async (title, quantity, unit_price) => {
	const pesos = unit_price
	const centavos = pesos * 100
	const session = await client.checkout.sessions.create({
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
		success_url: process.env.FRONT_DEPLOY,
		cancel_url: process.env.FRONT_DEPLOY,
	})

	return session.url
}

//* Tarjeta visa Argentina prueba 4000000320000021 COD 123 EXP 12/26

module.exports = createStripePreference
