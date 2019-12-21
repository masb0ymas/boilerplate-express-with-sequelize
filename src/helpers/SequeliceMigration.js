exports.addColumns = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map(item =>
          queryInterface.addColumn(tableName, item.key, {
            type: item.type,
          })
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map(item => queryInterface.removeColumn(tableName, item.key))
      )
    },
  }
}

exports.renameColumns = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map(item =>
          queryInterface.renameColumn(
            tableName,
            item.nameBefore,
            item.nameAfter
          )
        )
      )
    },

    down: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)

      return Promise.all(
        columns.map(item =>
          queryInterface.renameColumn(
            tableName,
            item.nameAfter,
            item.nameBefore
          )
        )
      )
    },
  }
}

exports.createTable = (tableName, newColumns) => {
  return {
    up: (queryInterface, Sequelize) => {
      const columns = newColumns(Sequelize)
      return queryInterface.createTable(tableName, {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        ...columns,
      })
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable(tableName)
    },
  }
}
