const {
	getAllUsersController,
	getUserByIdController,
	updateUserProfileController,
	updateUserByIdController,
	deleteUserController,
	getDeletedUsersController,
	getDeletedUserByIdController,
	restoreUserController,
} = require('../controllers/user-controller')

const getAllUsers = async (req, res) => {
	try {
		const query = req.query
		const user = req.user ? req.user : undefined
		const response = await getAllUsersController(query, user)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching users:', error)
		res.status(500).send(error.message)
	}
}

const getUserById = async (req, res) => {
	try {
		const { id } = req.params
		const response = await getUserByIdController(id)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching user by id:', error)
		res.status(500).send(error.message)
	}
}

const getUserProfile = async (req, res) => {
	try {
		const { id } = req.user
		const response = await getUserByIdController(id)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching user profile:', error)
		res.status(500).send(error.message)
	}
}

const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const userData = req.body;
        const response = await updateUserProfileController(userData, user);

        // Envía una respuesta basada en el status que devuelve updateUserProfileController
        res.status(response.status).json({
            message: response.message,
            user: response.user
        });
    } catch (error) {
        console.error('Error in updateUserProfile handler:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};


const updateUserById = async (req, res) => {
	try {
		const id = req.params.id
		const userData = req.body
		const response = await updateUserByIdController(userData, id)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error updating user profile:', error)
		res.status(500).send(error.message)
	}
}

const deleteUserProfile = async (req, res) => {
	try {
		const user = req.user
		const response = await deleteUserController(user.id)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error deleting user profile:', error)
		res.status(500).send(error.message)
	}
}

const deleteUserById = async (req, res) => {
	try {
		const { id } = req.params
		const response = await deleteUserController(id)
		res.status(200).json(response)
	} catch (error) {
		console.error('Error deleting user by id:', error)
		res.status(500).send(error.message)
	}
}

const getDeletedUsers = async (req, res) => {
	try {
		const response = await getDeletedUsersController()
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching deleted users:', error)
		res.status(500).json({ error: error.message })
	}
}

const getDeletedUserById = async (req, res) => {
	try {
		const response = await getDeletedUserByIdController()
		res.status(200).json(response)
	} catch (error) {
		console.error('Error fetching deleted user by Id:', error)
		res.status(500).json({ error: error.message })
	}
}

const restoreUser = async (req, res) => {
	try {
		const { id } = req.params
		const response = await restoreUserController(id)
		res.status(200).json(response)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

module.exports = {
	getAllUsers,
	getUserById,
	getUserProfile,
	updateUserProfile,
	updateUserById,
	deleteUserById,
	deleteUserProfile,
	getDeletedUsers,
	getDeletedUserById,
	restoreUser,
}
