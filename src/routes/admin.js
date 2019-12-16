import express from 'express'
import passport from 'passport'
import { Router as UnoRouter } from 'uno-api'
import { wrapperRequest } from '../helper'
import MulterMiddleware from '../middleware/Multer'

const router = express.Router()
const apiAdmin = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
  wrapperRequest,
})
require('../config/passport')(passport)

// Modules
const AuthController = require('../controllers/AuthController')
const RoleController = require('../controllers/RoleController')
const UserController = require('../controllers/UserController')

const setupMulterDoc = MulterMiddleware.setup(
  {
    destination(req, file, cb) {
      cb(null, './public/uploads/csv/')
    },
  },
  null,
  ['.csv', '.xls']
)

const multerUser = setupMulterDoc([{ name: 'phone', maxCount: 1 }])

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

// // Authentication
apiAdmin.create({
  baseURL: '/auth',
  putWithParam: [['change-password/:id', AuthController.changePass]],
})

apiAdmin.create({
  baseURL: '/profile',
  get: AuthController.getProfile,
})

// User
apiAdmin.create({
  baseURL: '/user',
  post: { middleware: multerUser, callback: UserController.storeData },
  putWithParam: [[':id', multerUser, UserController.updateData]],
  deleteWithParam: [[':id', UserController.destroyData]],
})

// Master Role
apiAdmin.create({
  baseURL: '/role',
  post: RoleController.storeData,
  putWithParam: [[':id', RoleController.updateData]],
  deleteWithParam: [[':id', RoleController.destroyData]],
})

module.exports = router
