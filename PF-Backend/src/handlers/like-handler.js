const {
	toggleProjectLikeController,
} = require('../controllers/like-controller')

const toggleProjectLike = async (req, res) => {
	try {
		const body = req.body
		const response = await toggleProjectLikeController(body)
		res.status(200).json(response)
	} catch (error) {
		res.status(500).send(error.message)
	}
}

module.exports = {
	toggleProjectLike,
}
