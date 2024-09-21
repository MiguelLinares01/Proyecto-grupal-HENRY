const { Router } = require('express')
const {
    toggleProjectLike
} = require('../handlers/like-handler')

const { verifyToken } = require('../middlewares/auth-middleware')

const likeRouter = Router()
likeRouter.post('/projects', verifyToken, toggleProjectLike)

module.exports = likeRouter
