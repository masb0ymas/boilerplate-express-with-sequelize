const ConstModel = require('../constants/ConstModel')
const { getAttributesFrom } = require('../migrations/helpers/MigrationHelpers')
const migration1 = require('../migrations/20191218102531-create-master-tipe-identitas')

/*
 order your migration from first to last
 'create' for migration add column
 'remove' for migration remove column

 migration1 -> nama, tanggal
 migration2 -> tanggal
 ex: [{ create: migration1 }, { remove: migration2 }]

 result: attributes -> nama
 because migration2 is for remove column
 */
const attributes = getAttributesFrom([
  {
    create: migration1,
  },
])

module.exports = (sequelize, DataTypes) => {
  const MasterTipeIdentitas = sequelize.define(
    'MasterTipeIdentitas',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      // you dont need declare column one by one anymore, just spread object attributes
      ...attributes,
    },
    {
      tableName: 'MasterTipeIdentitases',
      name: {
        plural: 'MasterTipeIdentitases',
        singular: 'MasterTipeIdentitas',
      },
      ...ConstModel.DEFAULT_SCOPE_NO_TIMESTAMP,
    }
  )
  MasterTipeIdentitas.associate = function (models) {
    // associations can be defined here
  }
  return MasterTipeIdentitas
}
