const { User, Link, Plan } = require('../db')
const { Op } = require('sequelize')
const AppError = require('../utils/error-util')
const { findOrCreateLinks } = require('../controllers/link-controller')
const bcrypt = require('bcrypt');
const {
	getUserIncludes,
	getUserOrder,
	getWhereCondition,
	getPagination,
} = require('../utils/user-utils')

const getAllUsersController = async (queries, user) => {
	try {
		const order = getUserOrder(queries)
		const where = getWhereCondition(queries)
		const include = getUserIncludes(queries)
		const pagination = await getPagination(queries, user)

		const users = await User.findAndCountAll({
			limit: pagination.limit,
			offset: pagination.offset,
			order,
			where,
			include,
		})

		return users.rows.map((project) => project.dataValues)
	} catch (error) {
		console.error('Error fetching users:', error)
		throw new Error(`Error fetching users: ${error.message}`)
	}
}

const getUserByIdController = async (id) => {
	try {
		const user = await User.findByPk(id, { include: getUserIncludes() })
		if (!user) throw new AppError('User not found', 404)
		return user
	} catch (error) {
		console.error(`Error fetching project with id ${id}`, error)
		throw new AppError(`Error fetching project with id ${id}`, 500)
	}
}

const updateUserProfileController = async (userData, user) => {
    const { currentPassword, newPassword, ...updateData } = userData;

    try {
        const userRecord = await User.findByPk(user.id);
        if (!userRecord) {
            return { status: 404, message: 'Usuario no encontrado' };
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, userRecord.password);
            if (!isMatch) {
                return { status: 400, message: 'Contraseña actual incorrecta' };
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await updateUserByIdController(updateData, user.id);

        return { status: 200, message: 'Usuario actualizado exitosamente', user: updatedUser };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { status: 500, message: 'Error al actualizar el usuario' };
    }
};





const updateUserByIdController = async (userData, id) => {
    try {
        const user = await User.findByPk(id, {
            include: getUserIncludes()
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Actualiza los datos del usuario
        await user.update({
            userName: userData.userName ?? user.userName,
            password: userData.password ?? user.password,
            bio: userData.bio ?? user.bio,
            aboutMe: userData.aboutMe ?? user.aboutMe,
            image: userData.image ?? user.image,
        });

        // Manejo de enlaces opcionales
        if (userData.links && Array.isArray(userData.links)) {
            const linkInstances = await findOrCreateLinks(userData.links);

            // Actualiza los enlaces asociados al usuario
            await user.setLinks(linkInstances);
        } else {
            console.log('No links data provided.');
        }
		if (userData.planName === 'Premium' || userData.planName === 'Free') {
		const plan = await Plan.findOne({where:{planName:userData.planName}});
			await user.setPlan(plan)
		}

        // Vuelve a cargar el usuario con los enlaces actualizados
        const updatedUser = await User.findByPk(id, {
            include: getUserIncludes()
        });

        console.log(`User updated successfully: ${JSON.stringify(updatedUser)}`);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new AppError('Error updating user', 500);
    }
};

const deleteUserController = async (id) => {
	try {
		const userToDelete = await User.findByPk(id)
		if (!userToDelete) throw new AppError('User not found', 404)
		await userToDelete.destroy()
		return { message: 'User deleted successfully' }
	} catch (error) {
		console.error(`Error deleting user by Id: ${error.message}`)
		throw new AppError(`Error deleting user`, 500)
	}
}

const getDeletedUsersController = async () => {
	try {
		let where = { deletedAt: { [Op.not]: null } }

		const users = await User.findAll({
			where,
			paranoid: false,
			include: getUserIncludes(),
		})

		return users
	} catch (error) {
		console.error('Error getting deleted user:', error)
		throw new AppError('Error fetching deleted user', 500)
	}
}

const getDeletedUserByIdController = async (id) => {
	try {
		const user = await User.findOne({
			where: { id },
			paranoid: false,
			include: getUserIncludes(),
		})

		if (!user) throw new AppError('No user found with the given id', 404)

		return user
	} catch (error) {
		console.error('Error fetching deleted project by Id', error)
		throw new AppError('Error fetching deleted user', 500)
	}
}

const restoreUserController = async (id) => {
	try {
		const user = await User.findOne({
			where: { id },
			paranoid: false,
			include: getUserIncludes(),
		})

		if (!user) throw new AppError('No user found with the given id', 404)

		await user.restore()

		return { message: 'User restored successfully' }
	} catch (error) {
		console.error('Error restoring user', error)
		throw new AppError('Error restoring user', 500)
	}
}

module.exports = {
	getAllUsersController,
	getUserByIdController,
	updateUserProfileController,
	updateUserByIdController,
	deleteUserController,
	getDeletedUsersController,
	getDeletedUserByIdController,
	restoreUserController,
}
