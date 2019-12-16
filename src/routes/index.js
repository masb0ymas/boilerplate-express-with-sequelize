import express from 'express'
import PublicRoute from './public'
import AdminRoute from './admin'

const router = express.Router()

router.use('/v1', PublicRoute)
router.use('/v1', AdminRoute)

module.exports = router
