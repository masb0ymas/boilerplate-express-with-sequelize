import SequelizeAttributes from 'utils/SequelizeAttributes'

module.exports = (sequelize, DataTypes) => {
  const MasterTipeIdentitases = sequelize.define(
    'MasterTipeIdentitases',
    {
      ...SequelizeAttributes.MasterTipeIdentitases,
    },
    {}
  )
  MasterTipeIdentitases.associate = function (models) {
    // associations can be defined here
  }
  return MasterTipeIdentitases
}
