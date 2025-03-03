const { Router } = require('express')
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const projectsRouter = require('./projectRouter')
const technologyRouter = require('./technologyRouter')
const paymentRouter = require('./paymentRouter')
const tagRouter = require('./tagRouter')
const likeRouter = require('./likeRouter')
const linkRouter = require('./linkRouter')
const contractRouter = require('./contractRouter')
const reviewRouter = require('./reviewRouter')
const metadataRouter = require('./metaDataRoute')

const router = Router()
router.use('/', authRouter)
router.use('/projects', projectsRouter)
router.use('/technologies', technologyRouter)
router.use('/users', userRouter)
router.use('/payment', paymentRouter)
router.use('/tags', tagRouter)
router.use('/likes', likeRouter)
router.use('/links', linkRouter)
router.use('/contracts', contractRouter)
router.use('/reviews', reviewRouter)
router.use('/metadata', metadataRouter)

module.exports = router
