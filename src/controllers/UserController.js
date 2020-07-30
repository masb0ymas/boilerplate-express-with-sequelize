import models from 'models'
import mvUser from 'models/validations/mvUser'
import SimpleMasterController from './base/SimpleMasterController'

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
