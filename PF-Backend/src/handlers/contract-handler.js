const {
	createContractController,
	getAllContractsController,
	getUserContractsController,
	getContractByIdController,
	deleteContractByIdController,
	getDeletedContractController,
	updateContractStatusController,
	createCommissionController,
	getCommissionByContractIdController,
} = require('../controllers/contract-controller')
const { User } = require('../db')
const sendContractRequestNotification = require('../mailer/contractRequest-notification')
const AppError = require('../utils/error-util')

const createContract = async (req, res) => {
	try {
		const contractData = req.body
		const contract = await createContractController(contractData)

		const sender = await User.findByPk(contract[0].dataValues.senderId)
		const receiver = await User.findByPk(contract[0].dataValues.receiverId)

		if (sender && receiver) {
			await sendContractRequestNotification(sender.email, receiver.email, contractData)
		}

		res.status(201).json(contract)
	} catch (error) {
		console.error('Error creating contract:', error)
		res.status(error.statusCode || 400).json({ error: error.message })
	}
}

const getAllContracts = async (req, res) => {
	try {
		const { role, id: userId } = req.user
		let contracts

		if (role === 'admin') {
			contracts = await getAllContractsController()
		} else if (role === 'user') {
			contracts = await getUserContractsController(userId)
		} else {
			throw new AppError('Unauthorized', 401)
		}

		res.status(200).json(contracts)
	} catch (error) {
		console.error('Error fetching contracts:', error)
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const getContractById = async (req, res) => {
	try {
		const { id } = req.params
		const userId = req.user.id
		const contract = await getContractByIdController(id, userId)

		res.status(200).json(contract)
	} catch (error) {
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const deleteContractById = async (req, res) => {
	try {
		const { id } = req.params
		const user = req.user
		const response = await deleteContractByIdController(id, user)

		res.status(200).json(response)
	} catch (error) {
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const getDeletedContracts = async (req, res) => {
	try {
		const deletedContracts = await getDeletedContractController()
		if (deletedContracts.length > 0) {
			res.status(200).json(deletedContracts)
		} else {
			res.status(404).json({ message: 'No deleted contracts found' })
		}
	} catch (error) {
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const updateContractStatus = async (req, res) => {
	const { contractId, status } = req.body
	try {
		const updatedContract = await updateContractStatusController(contractId, status)
		res.status(200).json(updatedContract)
	} catch (error) {
		res.status(error.statusCode || 500).json({ error: error.message })
	}
}

const createCommission = async (req, res, next) => {
	const { rate, amount, contractId } = req.body
	console.log(req.body)
	try {
		const commission = await createCommissionController({ rate, amount, contractId })
		res.status(201).json(commission)
	} catch (error) {
		next(new AppError(error.message, error.statusCode || 500))
	}
}

const getCommissionByContractId = async (req, res, next) => {
	const { contractId } = req.params
	try {
		const commission = await getCommissionByContractIdController(contractId)
		res.status(200).json(commission)
	} catch (error) {
		next(new AppError(error.message, error.statusCode || 500))
	}
}

module.exports = {
	createContract,
	getAllContracts,
	getContractById,
	deleteContractById,
	getDeletedContracts,
	updateContractStatus,
	createCommission,
	getCommissionByContractId,
}
