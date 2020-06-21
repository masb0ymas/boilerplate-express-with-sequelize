const { Type } = require('./helpers/MigrationHelpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      id: Type.primaryKeyUUID(true),
      nama: Type.string(true),
      createdAt: Type.date(true),
      updatedAt: Type.date(true),
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Roles');
  },
};
