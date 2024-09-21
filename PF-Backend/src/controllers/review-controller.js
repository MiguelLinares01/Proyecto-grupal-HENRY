const { Review } = require('../db')
const AppError = require('../utils/error-util')
const { reviewInclude } = require('../utils/review-util')

const getAllReviewsController = async () => {
	try {
		const reviews = await Review.findAll({ include: reviewInclude })
		return reviews
	} catch (error) {
		throw error
	}
}

const getReviewByIdController = async (id) => {
	try {
		const review = await Review.findByPk(id)
		if (!review) throw new AppError('Review not found', 404)
		return review
	} catch (error) {
		throw error
	}
}

const getUserReviewsController = async (id) => {
	try {
		const reviews = await Review.findAll({ where: { reviewedUserId: id } })
		if (!reviews) throw new AppError('Reviews not found', 404)
		return reviews
	} catch (error) {
		console.error('Error fetching user reviews', error);
		throw error
	}
}

const createReviewController = async ({ rating, comment, reviewedUserId }, userId) => {
	try {
		if (rating === null || rating === undefined) throw new Error('Rating is required')
		if (!reviewedUserId) throw new Error('Reviewed User ID is required')
		if (reviewedUserId === userId) throw new Error('User cannot review their own profile')

		const review = await Review.create({ rating, comment, reviewedUserId, reviewerId: userId })
		return review
	} catch (error) {
		console.error(`Failed to create a review:`, error)
		throw new Error(`Failed to create a review: ${error.message}`)
	}
}

const updateUserReviewController = async (reviewData) => {
	try {
		const updatingReview = await Review.findByPk(reviewData.id)
		await Review.update(
			{
				rating: reviewData.rating ?? updatingReview.rating,
				comment: reviewData.comment ?? updatingReview.comment,
			},
			{ where: { id: reviewData.id } }
		)
		const updatedReview = await Review.findByPk(updatingReview.id)
		return updatedReview
	} catch (error) {
		throw error
	}
}

// const updateUserReviewByIdController = async (reviewData) => {
// 	try {
//         const updatingReview = await Review.findByPk(reviewData.id)
// 		await Review.update(
// 			{
// 				rating: reviewData.rating ?? updatingReview.rating,
// 				comment: reviewData.comment ?? updatingReview.comment,
// 			},
// 			{ where: { id: reviewData.id } }
// 		)
// 		const updatedReview = await Review.findByPk(updatingReview.id)
// 		return updatedReview
// 	} catch (error) {
// 		throw error
// 	}
// }

const deleteUserReviewController = async (reviewData) => {
	try {
		const updatingReview = await Review.findByPk(reviewData.id)
		await Review.destroy({ where: { id: reviewData.id } })
		const deletedReview = await Review.findByPk(updatingReview.id)
		return 'Review deleted successfully'
	} catch (error) {
		throw error
	}
}


const deleteUserReviewByIdController = async (id) => {
    try {
        const review = await Review.findByPk(id);
        if (!review) {
            throw new Error('Review not found');
        }
        await Review.destroy({ where: { id } });
        return 'Review deleted successfully';
    } catch (error) {
		console.error(error);
        throw error;
    }
};


module.exports = {
	getAllReviewsController,
	getReviewByIdController,
	getUserReviewsController,
	createReviewController,
    updateUserReviewController,
    deleteUserReviewController,
    // updateUserReviewByIdController,
    deleteUserReviewByIdController
}
