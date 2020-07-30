import SequelizeAttributes from 'utils/SequelizeAttributes'

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      ...SequelizeAttributes.Roles,
    },
    {}
  )
  Role.associate = function (models) {
    // associations can be defined here
  }
  return Role
}
