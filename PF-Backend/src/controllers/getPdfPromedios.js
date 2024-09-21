const PDFDocument = require('pdfkit')
const averagePrice = require('../controllers/getPromedio-controller')
const path = require('path')
const { User } = require('../db')

const getAdmin = async () => {
	const admin = await User.findAll({
		where: {
			role: 'admin',
		},
		attributes: ['userName'],
		raw: true,
	})
	const adminNames = admin.map((user) => user.userName)
	console.log(adminNames)
	return adminNames
}

const getMetadata = async () => {
	try {
		const extraerInfo = await averagePrice()
		console.log(extraerInfo + ' log de extraerInfo', extraerInfo[0].averagePrice)
		return extraerInfo[0].averagePrice
	} catch (error) {
		console.error('Error getting metadata:', error)
	}
}

const generatePDF = (res, metadata, admins) => {
	console.log('Metadata in generatePDF:', metadata)
	console.log(admins)

	if (!metadata) {
		res.status(500).send('Metadata is undefined')
		return
	}

	if (!admins) {
		res.status(500).send('Admins list is undefined')
		return
	}

	const doc = new PDFDocument({
		info: {
			title: 'Sample PDF Document',
			author: 'Max',
			subject: 'Proyectos',
		},
	})

	res.setHeader('Content-disposition', 'attachment; filename=ejemplo.pdf')
	res.setHeader('Content-type', 'application/pdf')

	doc.registerFont('Lexend', path.join(__dirname, '../fonts/Lexend-VariableFont_wght.ttf'))

	doc.pipe(res)

	doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff')
	doc.fillColor('black')
	doc.font('Lexend').fontSize(20).text('ForDevs', 50, 50)

	// Línea divisoria
	doc.moveTo(50, 100).lineTo(550, 100).stroke()

	// Subtítulo
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

	// Títulos de las columnas
	doc
		.fontSize(12)
		.text('Admin', 50, columnY)
		.text('Income', 50 + columnGap, columnY)

	doc
		.moveTo(50, columnY + 15)
		.lineTo(550, columnY + 15)
		.stroke()

	// Contenido de las columnas
	admins.forEach((admin, index) => {
		doc
			.fontSize(11)
			.text(admin, 50, columnY + 20 + index * 20)
			.text((metadata || 0).toFixed(2).toString(), 50 + columnGap, columnY + 20 + index * 20)
	})

	// Footer
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
