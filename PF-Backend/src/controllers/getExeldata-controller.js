const ExcelJS = require('exceljs')

const generateExel = async (res, response) => {
	try {
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Datos')

		//* ENCABEZADOS
		worksheet.columns = [
			{ header: 'Fecha de creacion', key: 'CretedAt', width: 20 },
			{ header: 'Nombre', key: 'Nombre', width: 15 },
			{ header: 'Role', key: 'Role', width: 10 },
			{ header: 'Ganancia', key: 'Ganancia', width: 20 },
			{ header: 'Likes', key: 'Likes', width: 20 },
			{ header: 'Reviews', key: 'Reviews', width: 20 },
			{ header: 'Github', key: 'Github', width: 20 },
			{ header: 'LinkedIn', key: 'LinkedIn', width: 20 },
		]

		const data = Array.isArray(response) ? response : [response]
		console.log(data, ' log de data')

		const transformedData = data.map((item) => ({
			CretedAt: new Date(),
			Nombre: '',
			Role: '',
			Ganancia: item.roundedAveragePrice,
			Likes: item.likeCount,
			Reviews: item.reviewCount,
			Github: item.githubCount,
			LinkedIn: item.linkedInCount,
		}))

		transformedData.forEach((item) => {
			worksheet.addRow(item)
		})

		res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx')
		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		await workbook.xlsx.write(res)
		res.end()
	} catch (error) {
		console.error('Error al generar el archivo Excel:', error)
		res.status(500).send('Error al generar el archivo Excel')
	}
}

module.exports = generateExel
