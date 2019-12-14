import sQuery from 'sequelice-query'

const models = require('../models')
const Role = models.Role

async function getAll({ req, ResponseError }) {
  const { query } = req
  let { page, pageSize } = query

  if (!page) page = 0
  if (!pageSize) pageSize = 100

  let including = []

  let condition = await sQuery.generate({
    req,
    model: Role,
    configs: {
      include: including,
    },
  })

  let data = await Role.findAll({
    include: condition.include,
    where: condition.queryFilter,
    offset: parseInt(pageSize) * parseInt(page),
    limit: parseInt(pageSize),
    order: condition.querySort,
  })

  let totalRow = await Role.count({
    include: condition.includeCount,
    where: condition.queryFilter,
  })

  return { success: true, data, totalRow }
}

async function getOne({ req, ResponseError }) {
  const { params } = req
  const id = params.id

  const including = []

  let data = await Role.findByPk(id, {
    include: including,
  })

  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }
  return { success: true, data }
}

async function storeData({ req, ResponseError }) {
  const { headers, body } = req
  const token = getToken(headers)
  let { roleName } = body

  if (token) {
    let insert = await Role.create({
      roleName: roleName,
    })
    return { success: true, message: 'Data sudah ditambahkan', insert }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

async function updateData({ req, ResponseError }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  let { roleName } = body

  if (token) {
    let editData = await Role.findByPk(params.id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    let ObjDataUpdate = {
      roleName: roleName || editData.roleName,
    }
    await editData.update(ObjDataUpdate)
    return { success: true, message: 'Data berhasil diperbarui' }
  }
  throw new ResponseError(
    {
      success: false,
      message: 'Unauthorized. Please Re-login...',
    },
    403
  )
}

async function destroyData({ req, ResponseError }) {
  const { headers, params } = req
  const id = params.id
  const token = getToken(headers)

  if (token) {
    let checkData = await Role.findByPk(id)
    if (!checkData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    await checkData.destroy()
    return { success: true, message: 'Data berhasil dihapus!' }
  }
}

module.exports = {
  getAll,
  getOne,
  storeData,
  updateData,
  destroyData,
}
