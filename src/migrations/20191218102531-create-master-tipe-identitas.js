import SequeliceMigration from '../helpers/SequeliceMigration'
import { Type } from './helpers/MigrationHelpers'

const tableName = 'MasterTipeIdentitases'
const columns = {
  nama: Type.string(true),
}

module.exports = {
  ...SequeliceMigration.createTable(tableName, DataTypes => {
    return columns
  }),
  columns,
}
