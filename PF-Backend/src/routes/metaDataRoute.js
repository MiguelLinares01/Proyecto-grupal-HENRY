const { Router } = require('express')
const getDataHandler = require('../handlers/getPromedio-handler')
const pdf = require('../handlers/getPdfIncome-handler')
const exel = require('../handlers/getExel-handler')
const pdfReal = require('../handlers/getpdf')

const metadataRouter = Router()
metadataRouter.get('/data', getDataHandler)
metadataRouter.get('/pdf', pdf)
metadataRouter.get('/exel', exel)

module.exports = metadataRouter
