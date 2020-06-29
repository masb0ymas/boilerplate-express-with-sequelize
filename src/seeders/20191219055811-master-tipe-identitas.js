const SequeliceSeed = require('../helpers/SequeliceSeed')
const ConstMasterTipeIdentitas = require('../constants/ConstMasterTipeIdentitas')

const data = [
  {
    id: ConstMasterTipeIdentitas.ID_SIM,
    nama: 'SIM',
  },
  {
    id: ConstMasterTipeIdentitas.ID_KITAS,
    nama: 'KITAS',
  },
  {
    id: ConstMasterTipeIdentitas.ID_KTP,
    nama: 'KTP',
  },
]

module.exports = SequeliceSeed.createSeedData('MasterTipeIdentitases', data)
