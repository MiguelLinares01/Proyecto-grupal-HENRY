const metaDateDashboard = require('../controllers/getMetaData')

const getDataHandler = async (req, res) => {
	try {
		const data = await metaDateDashboard()
		res.status(200).json(data)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

module.exports = getDataHandler
