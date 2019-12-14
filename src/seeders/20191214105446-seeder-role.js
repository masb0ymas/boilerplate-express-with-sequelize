'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
        id: '366aadd0-eb0c-4203-9928-7ad87c80aafa',
        roleName: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4f1efd44-9919-44a8-89ca-32324c810496',
        roleName: 'Umum',
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
  }
};
