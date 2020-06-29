import models from '../models'
import SimpleMasterController from './base/SimpleMasterController'
import mvUser from '../models/validations/mvUser'

const { Role, User } = models

const including = [{ model: Role }]

module.exports = SimpleMasterController(User, mvUser, {
  configGetAll: {
    include: including,
  },
  configGetOne: {
    include: including,
  },
})
