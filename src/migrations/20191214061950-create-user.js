const { Type } = require('./helpers/MigrationHelpers')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: Type.primaryKeyUUID(true),
      fullName: Type.string(),
      email: Type.string(true, {
        unique: true,
        type: Sequelize.STRING('191'),
      }),
      password: Type.string(true),
      phone: Type.string(false, {
        defaultValue: null,
      }),
      RoleId: Type.foreignKeyUUID(),
      active: Type.boolean(true, {
        defaultValue: false,
      }),
      tokenVerify: Type.string(false, {
        defaultValue: null,
      }),
      createdAt: Type.date(true),
      updatedAt: Type.date(true),
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  },
}
