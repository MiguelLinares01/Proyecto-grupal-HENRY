const { Router } = require('express')
const getPromedioHandler = require('../handlers/getPromedio-handler')
const pdf = require('../handlers/getPdfIncome-handler')

const incomesRouter = Router()
incomesRouter.get('/income', getPromedioHandler)
incomesRouter.get('/pdf', pdf)

module.exports = incomesRouter
