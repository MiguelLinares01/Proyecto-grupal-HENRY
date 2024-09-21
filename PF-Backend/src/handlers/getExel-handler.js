const generateExel = require('../controllers/getExeldata-controller')
const metaData = require('../controllers/getMetaData')

const getExel = async (req, res) => {
	try {
		const response = await metaData()
		generateExel(res, response)
	} catch (error) {
		console.error('Error generating PDF:', error)
		res.status(500).json({ error: error.message })
	}
}

module.exports = getExel
