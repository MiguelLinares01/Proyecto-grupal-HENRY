const { generatePDF, getAdmin } = require('../controllers/getPdfIncome-controller')
const averagePrice = require('../controllers/getPromedio-controller')

const getIncomePdf = async (req, res) => {
	try {
		const admins = await getAdmin()
		console.log(admins, ' log de admins')
		const ganancia = await averagePrice()
		console.log(ganancia, ' log de metada')
		generatePDF(res, ganancia, admins)
	} catch (error) {
		console.error('Error generating PDF:', error)
		res.status(500).json({ error: error.message })
	}
}

module.exports = getIncomePdf
