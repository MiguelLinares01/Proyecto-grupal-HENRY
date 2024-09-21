const { Router } = require('express')
const contractRouter = Router()
const {
    createContract,
    getAllContracts,
    getContractById,
    deleteContractById,
    getDeletedContracts,
    updateContractStatus,
    createCommission,
    getCommissionByContractId,
} = require('../handlers/contract-handler')

const { verifyToken } = require('../middlewares/auth-middleware')

contractRouter.get('/', verifyToken, getAllContracts)
contractRouter.get('/:id', verifyToken, getContractById)
contractRouter.post('/', verifyToken, createContract)
contractRouter.delete('/:id', verifyToken, deleteContractById)
contractRouter.get('/deleted', verifyToken, getDeletedContracts)
contractRouter.patch('/status', verifyToken, updateContractStatus)
contractRouter.post('/create-commission', verifyToken, createCommission)
contractRouter.get('/commissions', verifyToken, getCommissionByContractId)

module.exports = contractRouter