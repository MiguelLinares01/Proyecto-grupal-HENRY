const { getMetadata, generatePDF, getAdmin } = require('../controllers/getPdfIncome-controller')

const getPdfHandler = async (req, res) => {
	try {
		const admins = await getAdmin()
		const metadata = await getMetadata()
		console.log('Metadata retrieved:', metadata)
		generatePDF(res, metadata, admins)
	} catch (error) {
		console.error('Error generating PDF:', error)
		res.status(500).json({ error: error.message })
	}
}

module.exports = getPdfHandler
