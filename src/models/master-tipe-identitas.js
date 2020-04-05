const ConstModel = require('../constants/ConstModel')

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
      nama: {
        type: DataTypes.STRING,
      },
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
  MasterTipeIdentitas.associate = function(models) {
    // associations can be defined here
  }
  return MasterTipeIdentitas
}
