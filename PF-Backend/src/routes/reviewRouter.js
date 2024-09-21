const { Router } = require('express')
const {
    getAllReviews,
    getReviewById,
    getUserReviews,
    createReview,
    updateUserReview,
    deleteUserReview,
    // updateUserReviewById,
    deleteUserReviewById
} = require('../handlers/review-handler')

const { checkPremium } = require('../middlewares/premium_moddleware')
const { verifyToken, authenticate } = require('../middlewares/auth-middleware')
const { checkAdmin } = require('../middlewares/admin_middleware')

const reviewRouter = Router()
reviewRouter.get('/', authenticate, getAllReviews)
reviewRouter.get('/:id', verifyToken, getReviewById)
reviewRouter.get('/users/:id', verifyToken, getUserReviews)
reviewRouter.post('/', verifyToken, checkPremium, createReview)
reviewRouter.put('/', verifyToken, updateUserReview)
reviewRouter.delete('/profile/:id', verifyToken, deleteUserReviewById)
// reviewRouter.put('/', verifyToken, checkAdmin, updateUserReviewById)
reviewRouter.delete('/:id', verifyToken, checkAdmin, deleteUserReviewById)

module.exports = reviewRouter
