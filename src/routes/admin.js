import express from 'express'
import passport from 'passport'
import { Router as UnoRouter } from 'uno-api'
import { wrapperRequest } from '../helper'

let router = express.Router()
const apiAdmin = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
})
require('../config/passport')(passport)

// Modules
const AuthController = require('../controllers/AuthController')
const RoleController = require('../controllers/RoleController')
const UserController = require('../controllers/UserController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

// // Authentication
apiAdmin.create({
  baseURL: '/auth',
  putWithParam: [['change-password/:id', AuthController.changePass]],
  wrapperRequest,
})

apiAdmin.create({
  baseURL: '/profile',
  get: AuthController.getProfile,
  wrapperRequest,
})

// User
apiAdmin.create({
  baseURL: '/user',
  post: UserController.storeData,
  putWithParam: [[':id', UserController.updateData]],
  deleteWithParam: [[':id', UserController.destroyData]],
  wrapperRequest,
})

// Master Role
apiAdmin.create({
  baseURL: '/role',
  post: RoleController.storeData,
  putWithParam: [[':id', RoleController.updateData]],
  deleteWithParam: [[':id', RoleController.destroyData]],
  wrapperRequest,
})

module.exports = router
