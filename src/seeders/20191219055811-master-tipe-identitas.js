const SequeliceSeed = require('../helpers/SequeliceSeed')
const ConstMasterTipeIdentitas = require('../constants/ConstMasterTipeIdentitas')

const data = [
  {
    id: ConstMasterTipeIdentitas.ID_SIM,
    nama: 'SIM',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: ConstMasterTipeIdentitas.ID_KITAS,
    nama: 'KITAS',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: ConstMasterTipeIdentitas.ID_KTP,
    nama: 'KTP',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = SequeliceSeed.createSeedData('MasterTipeIdentitases', data)
