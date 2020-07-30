import bcrypt from 'bcrypt'
import SequelizeAttributes from 'utils/SequelizeAttributes'

const mvUser = require('./validations/mvUser')

function setUserPassword(instance) {
  const { newPassword, confirmNewPassword } = instance
  const fdPassword = { newPassword, confirmNewPassword }
  const validPassword = mvUser
    .getCreateSchema()
    .validateSyncAt('confirmNewPassword', fdPassword)
  const saltRounds = 10
  const hash = bcrypt.hashSync(validPassword, saltRounds)
  instance.setDataValue('password', hash)
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      ...SequelizeAttributes.Users,
      newPassword: {
        type: DataTypes.VIRTUAL,
      },
      confirmNewPassword: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      hooks: {
        beforeCreate(instance) {
          setUserPassword(instance)
        },
        beforeUpdate(instance) {
          const { newPassword, confirmNewPassword } = instance
          if (newPassword || confirmNewPassword) {
            setUserPassword(instance)
          }
        },
      },
      defaultScope: {
        attributes: {
          exclude: ['password', 'tokenVerify'],
        },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  )

  // Compare password
  User.prototype.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) reject(err)
        resolve(isMatch)
      })
    })
  }

  User.associate = function (models) {
    // associations can be defined here
    User.belongsTo(models.Role, {
      foreignKey: 'RoleId',
    })
  }
  return User
}
