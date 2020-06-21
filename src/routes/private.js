import express from 'express';
import passport from 'passport';
import { Router as UnoRouter } from 'uno-api';
import { wrapperRequest } from '#helpers';
import multerCSV from '#middleware';

/* Setup Router With Middleware */
const router = express.Router();
const apiPrivate = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
  wrapperRequest,
});
require('#config/passport')(passport);

/* Declare Controller */
const AuthController = require('#controllers/AuthController');
const RoleController = require('#controllers/RoleController');
const UserController = require('#controllers/UserController');

/* Authentication */
apiPrivate.create({
  baseURL: '/auth',
  putWithParam: [['change-password/:id', AuthController.changePass]],
});

apiPrivate.create({
  baseURL: '/profile',
  get: AuthController.getProfile,
});

/* User */
apiPrivate.create({
  baseURL: '/user',
  post: [multerCSV, UserController.create],
  putWithParam: [[':id', multerCSV, UserController.update]],
  deleteWithParam: [[':id', UserController.destroy]],
});

/* Master Role */
apiPrivate.create({
  baseURL: '/role',
  post: RoleController.create,
  putWithParam: [[':id', RoleController.update]],
  deleteWithParam: [[':id', RoleController.destroy]],
});

module.exports = router;
