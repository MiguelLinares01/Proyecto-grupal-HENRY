const { Op } = require('sequelize')
const { Project } = require('../db')
const AppError = require('../utils/error-util')
const { findOrCreateTags } = require('../controllers/tag-controller')
const { findOrCreateTechnologies } = require('../controllers/technology-controller')
const {
	getProjectIncludes,
	getProjectOrder,
	getWhereCondition,
	getPagination,
} = require('../utils/project-util')

const getAllProjectsController = async (queries, user) => {
	try {
		const order = getProjectOrder(queries)
		const where = getWhereCondition(queries)
		const include = getProjectIncludes(queries)
		const { offset, limit } = (await getPagination(queries, user)) || {}

		const projects = await Project.findAndCountAll({
			limit,
			offset,
			order,
			where,
			include,
		})

		return projects.rows.map((project) => project.dataValues)
	} catch (error) {
		console.error('Error fetching projects:', error)
		throw new Error(`Error fetching projects: ${error.message}`)
	}
}

const getProjectByIdController = async (id, user) => {
	try {
		const project = await Project.findByPk(id, {
			include: getProjectIncludes(),
		})

		if (!project) throw new AppError(`Project with id ${id} not found`, 404)

		return project.dataValues
	} catch (error) {
		console.error(`Error fetching project with id ${id}`, error)
		throw new AppError(`Error fetching project with id ${id}`, 500)
	}
}

const createProjectController = async (projectData, user) => {
	try {
		const { title, description, tags, technologies, image } = projectData
		const [project, created] = await Project.findOrCreate({
			where: { title, userId: user.id },
			defaults: { description, image },
		})
		if (!created) throw new AppError('This project already exists in the database!', 400)

		const tagNames = tags.map((t) => (typeof t === 'string' ? t : t.tagName))
		const techNames = technologies.map((t) => (typeof t === 'string' ? t : t.name))
		const tagInstances = await findOrCreateTags(tagNames)
		const techInstances = await findOrCreateTechnologies(techNames)

		if (techInstances.length !== techNames.length)
			throw new AppError('Some technologies were not found in the database', 400)

		await project.addTechnologies(techInstances)
		await project.addTags(tagInstances)

		const newProject = await Project.findByPk(project.id, {
			include: getProjectIncludes(),
		})

		return newProject
	} catch (error) {
		console.error(error)
		throw new AppError('Error creating a project', 500)
	}
}

const updateProjectController = async (projectData, user) => {
	try {
		const project = await Project.findByPk(projectData.id)
		if (!project) throw new AppError('Project not found', 404)

		if (project.userId !== user.id && user.role !== 'admin') {
			throw new AppError('You do not have permission to edit this project', 403)
		}

		const updatedProject = await updateProjectByIdController(projectData)

		return updatedProject
	} catch (error) {
		console.error('Error updating project:', error)
		throw new AppError('Error updating project', 500)
	}
}

const updateProjectByIdController = async (projectData) => {
	try {
		const project = await Project.findByPk(projectData.id)
		if (!project) throw new AppError('Project not found', 404)

		await project.update({
			title: projectData.title ?? project.title,
			description: projectData.description ?? project.description,
			image: projectData.image ?? project.image,
		})

		if (projectData.tags) {
			const tagInstances = await findOrCreateTags(projectData.tags)
			await project.setTags(tagInstances)
		}

		if (projectData.technologies) {
			const technologyInstances = await findOrCreateTechnologies(projectData.technologies) // Cambiado a projectData.technologies
			await project.setTechnologies(technologyInstances)
		}

		const updatedProject = await Project.findByPk(projectData.id, {
			include: getProjectIncludes(),
		})

		return updatedProject
	} catch (error) {
		console.error('Error updating project:', error)
		throw new AppError('Error updating project', 500)
	}
}

const deleteProjectController = async (id, user) => {
	try {
		const project = await Project.findByPk(id)
		if (!project) throw new AppError('Project not found', 404)
		await Project.destroy({ where: { id } })
		return { message: 'Project deleted successfully' }
	} catch (error) {
		console.error('Error deleting projects:', error)
		throw new AppError(error.message || 'Error deleting project', error.status || 500)
	}
}

const getDeletedProjectsController = async (user) => {
	try {
		let where = { deletedAt: { [Op.not]: null } }
		if (user.role !== 'admin') where = { ...where, userId: user.id }

		const projects = await Project.findAll({
			where,
			paranoid: false,
			include: getProjectIncludes({ exclude: 'user,likes' }),
		})

		return projects
	} catch (error) {
		console.error('Error getting deleted projects:', error)
		throw new AppError('Error fetching deleted projects', 500)
	}
}

const getDeletedProjectByIdController = async (id) => {
	try {
		const project = await Project.findOne({
			where: { id },
			paranoid: false,
			include: getProjectIncludes(),
		})

		if (!project) throw new AppError('No project found with the given id', 404)

		return project
	} catch (error) {
		console.error('Error fetching deleted project by Id', error)
		throw new AppError('Error fetching deleted project', 500)
	}
}

const restoreProjectController = async (id) => {
	try {
		const project = await Project.findOne({
			where: { id },
			paranoid: false,
			include: getProjectIncludes(),
		})

		if (!project) throw new AppError('No deleted project found with the given id', 404)

		await project.restore()

		return { message: 'Project restored successfully' }
	} catch (error) {
		console.error('Error restoring project', error)
		throw new AppError('Error restoring project', 500)
	}
}

module.exports = {
	getAllProjectsController,
	getProjectByIdController,
	createProjectController,
	updateProjectController,
	deleteProjectController,
	restoreProjectController,
	getDeletedProjectsController,
	getDeletedProjectByIdController,
	updateProjectByIdController,
}
