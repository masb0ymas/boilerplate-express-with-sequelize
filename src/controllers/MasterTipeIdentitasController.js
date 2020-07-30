import models from 'models'
import mvBaseMaster from 'models/validations/mvBaseMaster'
import SimpleMasterController from './base/SimpleMasterController'

const { MasterTipeIdentitases } = models

module.exports = SimpleMasterController(MasterTipeIdentitases, mvBaseMaster)
