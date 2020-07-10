module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      nama: DataTypes.STRING,
    },
    {}
  )
  Role.associate = function (models) {
    // associations can be defined here
  }
  return Role
}
