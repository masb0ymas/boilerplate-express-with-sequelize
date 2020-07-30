const ConstRoles = require('constants/ConstRoles')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: ConstRoles.ID_ADMIN,
        nama: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: ConstRoles.ID_UMUM,
        nama: 'Umum',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
}
