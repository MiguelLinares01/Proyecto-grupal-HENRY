const { Router } = require('express')
const paymentRouter = Router()
const {
	mercadoPagoPreference,
	mercadoPagoNotification,
	cancelSubscription,
	stripeWebhook,
	stripePreference,
} = require('../handlers/payment-handler')

const { verifyToken } = require('../middlewares/auth-middleware')

paymentRouter.post('/preference', verifyToken, mercadoPagoPreference)
paymentRouter.post('/notification', mercadoPagoNotification)
paymentRouter.post('/cancel', verifyToken, cancelSubscription)
paymentRouter.post('/stripe/webhook', stripeWebhook)
paymentRouter.post('/stripe/preference', verifyToken, stripePreference)

module.exports = paymentRouter
