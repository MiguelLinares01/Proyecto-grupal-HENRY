const { Router } = require('express')
const userRouter = Router()
const {
	getAllUsers,
	getUserById,
	getUserProfile,
	getDeletedUsers,
	getDeletedUserById,
	updateUserProfile,
	updateUserById,
	deleteUserById,
	deleteUserProfile,
	restoreUser,
} = require('../handlers/user-handler')

const { verifyToken, authenticate } = require('../middlewares/auth-middleware')
const { checkAdmin } = require('../middlewares/admin_middleware')

userRouter.get('/', authenticate, getAllUsers)
userRouter.get('/profile', verifyToken, getUserProfile)
userRouter.get('/deleted', verifyToken, getDeletedUsers)
userRouter.get('/deleted/:id', verifyToken, getDeletedUserById)
userRouter.get('/:id', getUserById)
userRouter.put('/profile', verifyToken, updateUserProfile)
userRouter.put('/:id', verifyToken, checkAdmin, updateUserById)
userRouter.delete('/', verifyToken, deleteUserProfile)
userRouter.delete('/:id', verifyToken, checkAdmin, deleteUserById)
userRouter.post('/restore/:id', verifyToken, restoreUser)

module.exports = userRouter
