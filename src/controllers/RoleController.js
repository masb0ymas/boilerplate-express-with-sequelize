import models from 'models'
import mvRole from 'models/validations/mvRole'
import SimpleMasterController from './base/SimpleMasterController'

const { Role } = models

module.exports = SimpleMasterController(Role, mvRole)
