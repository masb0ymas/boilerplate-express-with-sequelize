import express from 'express'
import PublicRoute from './public'
import PrivateRoute from './private' // with middleware

const router = express.Router()

/* Home Page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    description: 'Powered by Nusantech',
  })
})

/* Forbidden Page. */
router.get('/v1', function(req, res, next) {
  res.render('index', {
    title: 'Hayo Mau ngapain ??',
    description: 'Forbidden Access',
    code: '403',
  })
})

router.use('/v1', PublicRoute)
router.use('/v1', PrivateRoute)

module.exports = router
