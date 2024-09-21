const { getAllLinksController } = require('../controllers/link-controller')

const getAllLinks = async (req, res) => {    
    try {
        const response = await getAllLinksController()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllLinks
}