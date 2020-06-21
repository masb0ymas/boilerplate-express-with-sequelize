import models from '../models';
import SimpleMasterController from './base/SimpleMasterController';
import mvBaseMaster from '../models/validations/mvBaseMaster';

const { MasterTipeIdentitas } = models;

module.exports = SimpleMasterController(MasterTipeIdentitas, mvBaseMaster);
