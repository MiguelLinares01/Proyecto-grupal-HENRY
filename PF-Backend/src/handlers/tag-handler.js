const { getAllTagsController } = require('../controllers/tag-controller')

const getAllTags = async (req, res) => {
	const { name } = req.query
	try {
		const response = await getAllTagsController(name)
		return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

module.exports = {
    getAllTags
}