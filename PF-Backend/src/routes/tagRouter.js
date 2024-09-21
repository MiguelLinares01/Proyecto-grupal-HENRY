const { Router } = require('express')
const { getAllTags } = require('../handlers/tag-handler')

const tagRouter = Router()

tagRouter.get('/', getAllTags)

module.exports = tagRouter