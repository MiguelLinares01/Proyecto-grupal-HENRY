const { Link } = require('../db')

const getAllLinksController = async () => {
	try {
		const allLinks = await Link.findAll()
		return allLinks
	} catch (error) {
		throw new Error('Links not found')
	}
}

const findOrCreateLinks = async (links) => {
	return Promise.all(
		links.map(async (linkData) => {
			console.log(linkData);
			const [link] = await Link.findOrCreate({
				where: linkData,
			})
			return link
		})
	)
}

module.exports = {
	getAllLinksController,
	findOrCreateLinks,
}
