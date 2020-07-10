/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt')
const mvUser = require('./validations/mvUser')
const SequelizeHelpers = require('../helpers/SequelizeHelpers')

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
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Email address already in use',
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      RoleId: {
        type: DataTypes.UUID,
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      tokenVerify: {
        type: DataTypes.STRING,
      },
      newPassword: {
        type: DataTypes.VIRTUAL,
      },
      confirmNewPassword: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      validate: {
        async isMasterValid() {
          const { Role } = sequelize.models

          const masterValidations = [[Role, this.RoleId, 'Role']]

          for (let i = 0; i < masterValidations.length; i += 1) {
            const [model, id, str] = masterValidations[i]
            // eslint-disable-next-line no-await-in-loop
            await SequelizeHelpers.throwIfNotExist(
              model,
              id,
              `Invalid data ${str}`
            )
          }
        },
      },
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
          exclude: ['password'],
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
