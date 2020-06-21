import models from '../models';
import SimpleMasterController from './base/SimpleMasterController';
import mvRole from '../models/validations/mvRole';

const { Role } = models;

module.exports = SimpleMasterController(Role, mvRole);
