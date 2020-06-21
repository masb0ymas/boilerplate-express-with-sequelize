import express from 'express';
import { Router as UnoRouter } from 'uno-api';
import { wrapperRequest } from '#helpers';

/* Setup Router */
const router = express.Router();
const apiPublic = new UnoRouter(router, {
  wrapperRequest,
});

/* Declare Controller */
const AuthController = require('#controllers/AuthController');
const RoleController = require('#controllers/RoleController');
const UserController = require('#controllers/UserController');

/* Master Controller */
const MasterTipeIdentitasController = require('#controllers/MasterTipeIdentitasController');

/* Authentication */
apiPublic.create({
  baseURL: '/auth',
  postWithParam: [
    ['signup', AuthController.signUp],
    ['signin', AuthController.signIn],
  ],
});

/* User */
apiPublic.create({
  baseURL: '/user',
  get: UserController.getAll,
  getWithParam: [[':id', UserController.getOne]],
});

/* Role */
apiPublic.create({
  baseURL: '/role',
  get: RoleController.getAll,
  getWithParam: [[':id', RoleController.getOne]],
});

/* Master Tipe Identitas */
apiPublic.create({
  baseURL: '/master-tipe-identitas',
  get: MasterTipeIdentitasController.getAll,
  getWithParam: [[':id', MasterTipeIdentitasController.getOne]],
});

module.exports = router;
