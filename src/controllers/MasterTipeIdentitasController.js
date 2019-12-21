import models from '../models'
import SimpleMasterController from './base/BaseMasterController'
import mvBaseMaster from '../models/validations/mvBaseMaster'

const { MasterTipeIdentitas } = models

module.exports = SimpleMasterController(MasterTipeIdentitas, mvBaseMaster)
