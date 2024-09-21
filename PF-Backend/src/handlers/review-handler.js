const {
	getAllReviewsController,
	getReviewByIdController,
	getUserReviewsController,
	createReviewController,
	updateUserReviewController,
	deleteUserReviewController,
	// updateUserReviewByIdController,
	deleteUserReviewByIdController,
} = require('../controllers/review-controller')

const getAllReviews = async (req, res) => {
	try {
		const response = await getAllReviewsController()
		res.status(200).json(response)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getReviewById = async (req, res) => {
	try {
		const { id } = req.params
		console.log(params);
		const response = await getReviewByIdController(id)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

const getUserReviews = async (req, res) => {
	try {
		const { id } = req.params
		const response = await getUserReviewsController(id)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

const createReview = async (req, res) => {
	try {
		const body = req.body
		const { id } = req.user
		const response = await createReviewController(body, id)
		res.status(201).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

const updateUserReview = async (req, res) => {
	try {
		const body = req.body
		const { id } = req.user
		const response = await updateUserReviewController(body, id)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

// const updateUserReviewById = async (req, res) => {
// 	try {
// 		const body = req.body
// 		const { id } = req.params
// 		const response = await updateUserReviewByIdController(body, id)
// 		res.status(200).json(response)
// 	} catch (error) {
// 		res.status(500).send(error.message)
// 	}
// }

const deleteUserReview = async (req, res) => {
	try {
		const body = req.body
		const { id } = req.user
		const response = await deleteUserReviewController(body, id)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

const deleteUserReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await deleteUserReviewByIdController(id);
        res.status(200).json({ message: response });
    } catch (error) {
		console.error(error);
        res.status(500).send(error.message);
    }
};


module.exports = {
	getAllReviews,
	getReviewById,
	getUserReviews,
	createReview,
	updateUserReview,
	deleteUserReview,
	// updateUserReviewById,
	deleteUserReviewById,
}
