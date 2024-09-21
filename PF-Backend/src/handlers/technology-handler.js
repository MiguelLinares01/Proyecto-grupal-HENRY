const { getAllTechnologiesController , createTechnologyController} = require('../controllers/technology-controller')

const getAllTechnologies = async (req, res) => {    
    try {
        const { name } = req.query;
        const response = await getAllTechnologiesController(name)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
const createTechnology = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ error: 'Technology name is required' });
		}
		const newTechnology = await createTechnologyController(name);
		return res.status(201).json(newTechnology);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
    getAllTechnologies,
    createTechnology
}