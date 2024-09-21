const { Like } = require('../db')
const AppError = require('../utils/error-util')

const toggleProjectLikeController = async ({ userId, projectId }) => {
	try {
		const [likedProject, created] = await Like.findOrCreate({
			where: { userId, projectId },
		})

		if (!created) {
			await likedProject.destroy()
			return 'Like removed from project'
		}

		return 'Project liked'
	} catch (error) {
		console.error(error)
		throw new AppError('Error toggling project like', 500)
	}
}

module.exports = {
	toggleProjectLikeController,
}
