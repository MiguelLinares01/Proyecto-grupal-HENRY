const { Router } = require('express')
const {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	restoreProject,
	getDeletedProjects,
	getDeletedProjectById,
	updateProjectById,
} = require('../handlers/project-handler')

const { verifyToken, authenticate } = require('../middlewares/auth-middleware')
const { checkAdmin } = require('../middlewares/admin_middleware')

const projectRouter = Router()
projectRouter.get('/', authenticate, getAllProjects)
projectRouter.get('/deleted', verifyToken, getDeletedProjects)
projectRouter.get('/deleted/:id', verifyToken, getDeletedProjectById)
projectRouter.get('/:id', authenticate, getProjectById)
projectRouter.post('/', verifyToken, createProject)
projectRouter.post('/restore/:id', verifyToken, restoreProject)
projectRouter.put('/profile/:id', verifyToken, updateProject)
projectRouter.put('/:id', checkAdmin , updateProjectById)
projectRouter.delete('/:id', verifyToken, deleteProject)

module.exports = projectRouter
