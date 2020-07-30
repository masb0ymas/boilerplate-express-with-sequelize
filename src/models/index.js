/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const sQuery = require('sequelice-query')

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/database`)[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sQuery.generateWithPagination = async ({ req, model, configs }) => {
  const condition = await sQuery.generate({
    req,
    model,
    configs,
  })

  let { page, pageSize } = req.query

  if (!page) page = 0
  if (!pageSize) pageSize = 10

  return {
    ...condition,
    offset: parseInt(pageSize) * parseInt(page),
    limit: parseInt(pageSize),
  }
}

module.exports = db
