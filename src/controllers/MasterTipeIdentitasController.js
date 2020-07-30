import models from 'models'
import mvBaseMaster from 'models/validations/mvBaseMaster'
import SimpleMasterController from './base/SimpleMasterController'

const { MasterTipeIdentitas } = models

module.exports = SimpleMasterController(MasterTipeIdentitas, mvBaseMaster)
