/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      RoleId: DataTypes.UUIDV4,
      active: DataTypes.BOOLEAN,
      tokenVerify: DataTypes.STRING,
    },
    {}
  )

  // Hash password before save
  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      )
    }
  })

  // Compare password
  User.prototype.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) reject(err)
        resolve(isMatch)
      })
    })
  }

  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Role, {
      foreignKey: 'RoleId',
      onDelete: 'CASCADE',
    })
  }
  return User
}
