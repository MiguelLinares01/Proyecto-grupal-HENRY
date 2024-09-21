const {
	getAllProjectsController,
	getProjectByIdController,
	createProjectController,
	updateProjectController,
	deleteProjectController,
	restoreProjectController,
	getDeletedProjectsController,
	getDeletedProjectByIdController,
	updateProjectByIdController,
} = require('../controllers/project-controller')

const getAllProjects = async (req, res) => {
	try {
		const queries = req.query
		const user = req.user ? req.user : undefined
		const response = await getAllProjectsController(queries, user)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getDeletedProjectById = async (req, res) => {
	try {
		const { id } = req.params
		const response = await getDeletedProjectByIdController(id)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const createProject = async (req, res) => {
	try {
		const user = req.user
		const projectData = req.body
		const response = await createProjectController(projectData, user)
		res.status(201).json(response)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

const updateProject = async (req, res) => {
	try {
		const { id } = req.params
		const projectData = req.body
		const user = req.user
		const response = await updateProjectController({ ...projectData, id }, user)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error updating project:', error)
		res.status(500).json({ error: error.message })
	}
}

const updateProjectById = async (req, res) => {
	try {
		const { id } = req.params
		const projectData = req.body
		const response = await updateProjectByIdController({ ...projectData, id })
		res.status(200).json(response)
	} catch (error) {
		console.error('Error updating project by ID:', error)
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const deleteProject = async (req, res) => {
	try {
		const { id } = req.params
		const user = req.user
		const response = await deleteProjectController(id, user)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getDeletedProjects = async (req, res) => {
	try {
		const user = req.user
		const response = await getDeletedProjectsController(user)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching deleted projects:', error)
		res.status(500).json({ error: error.message })
	}
}

const getProjectById = async (req, res) => {
	try {
		const { id } = req.params
		const user = req.user ? req.user : undefined
		const response = await getProjectByIdController(id, user)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const restoreProject = async (req, res) => {
	try {
		const { id } = req.params
		const response = await restoreProjectController(id)
		res.status(200).json(response)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

module.exports = {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	restoreProject,
	getDeletedProjects,
	getDeletedProjectById,
	updateProjectById,
}
