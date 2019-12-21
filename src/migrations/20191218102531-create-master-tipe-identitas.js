import SequeliceMigration from '../helpers/SequeliceMigration'

module.exports = SequeliceMigration.createTable(
  'MasterTipeIdentitases',
  DataTypes => {
    return {
      nama: {
        type: DataTypes.STRING,
      },
    }
  },
)
