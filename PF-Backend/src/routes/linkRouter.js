const { Router } = require('express')
const {
    getAllLinks,
} = require('../handlers/link-handler')

const { verifyToken } = require('../middlewares/auth-middleware')

const linkRouter = Router()
linkRouter.get('/', verifyToken, getAllLinks)

module.exports = linkRouter
