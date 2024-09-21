const server = require('./src/app.js')
const { conn } = require('./src/db.js')
const PORT = process.env.PORT || 3001

const createSeeders = require('./src/seeders.js')

conn
	.sync({ alter: true })
	.then(() => {
		server.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`)
			createSeeders()
		})
	})
	.catch((error) => console.error(error))
