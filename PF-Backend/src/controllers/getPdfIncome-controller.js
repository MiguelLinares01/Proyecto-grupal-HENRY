const PDFDocument = require('pdfkit')
const averagePrice = require('./getPromedio-controller')
const path = require('path')
const { User } = require('../db')

const getAdmin = async () => {
	try {
		const admins = await User.findAll({
			where: { role: 'admin' },
			attributes: ['userName'],
			raw: true,
		})
		return admins.map((user) => user.userName)
	} catch (error) {
		console.error('Error fetching admins:', error)
		return []
	}
}

const getMetadata = async () => {
	try {
		const average = await averagePrice()
		return average
	} catch (error) {
		console.error('Error getting metadata:', error)
		return null
	}
}

const generatePDF = (res, metadata, admins) => {
	if (metadata === null || metadata === undefined) {
		res.status(500).send('Metadata is undefined')
		return
	}

	if (!admins || admins.length === 0) {
		res.status(500).send('Admins list is undefined')
		return
	}

	const doc = new PDFDocument({
		info: {
			title: 'Income',
			author: 'ForDevs',
			subject: 'Projects',
		},
	})

	res.setHeader('Content-disposition', 'attachment; filename=ejemplo.pdf')
	res.setHeader('Content-type', 'application/pdf')

	doc.registerFont('Lexend', path.join(__dirname, '../fonts/Lexend-VariableFont_wght.ttf'))

	doc.pipe(res)

	doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff')
	doc.fillColor('black')
	doc.font('Lexend').fontSize(20).text('ForDevs', 50, 50)

	doc.moveTo(50, 100).lineTo(550, 100).stroke()

	doc
		.fontSize(13)
		.text('Este es el resumen mensual de ganancias para los administradores de ForDevs.', 50, 120)
		.moveDown(2)
		.text(
			'Este informe proporciona un resumen detallado de las ganancias obtenidas durante el mes.',
			50,
			160
		)

	const columnY = 220
	const columnGap = 200

	doc
		.fontSize(12)
		.text('Admin', 50, columnY)
		.text('Income', 50 + columnGap, columnY)

	doc
		.moveTo(50, columnY + 15)
		.lineTo(550, columnY + 15)
		.stroke()

	admins.forEach((admin, index) => {
		doc
			.fontSize(11)
			.text(admin, 50, columnY + 20 + index * 20)
			.text(parseFloat(metadata).toFixed(2).toString(), 50 + columnGap, columnY + 20 + index * 20)
	})

	const footerY = doc.page.height - 100
	doc
		.moveTo(50, footerY - 20)
		.lineTo(550, footerY - 20)
		.stroke()
	doc
		.fontSize(10)
		.text('Atentamente ForDevs', 50, footerY)
		.text('pf-fordevs.vercel.app', 50, footerY + 15)

	doc.end()
}

module.exports = { generatePDF, getMetadata, getAdmin }
