import sQuery from 'sequelice-query'
import { getToken } from '../helper'

const models = require('../models')
const User = models.User
const Role = models.Role

async function getAll({ req, ResponseError }) {
  const { query } = req
  let { page, pageSize } = query

  if (!page) page = 0
  if (!pageSize) pageSize = 10

  let including = [{ model: Role }]

  let condition = await sQuery.generate({
    req,
    model: User,
    configs: {
      include: including,
    },
  })

  let data = await User.findAll({
    include: condition.include,
    where: condition.queryFilter,
    offset: parseInt(pageSize) * parseInt(page),
    limit: parseInt(pageSize),
    order: condition.querySort,
  })

  let totalRow = await User.count({
    include: condition.includeCount,
    where: condition.queryFilter,
  })

  return { data, totalRow }
}

async function getOne({ req, ResponseError }) {
  const { params } = req
  const id = params.id

  const including = []

  let data = await User.findByPk(id, {
    include: including,
  })
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }

  return { data }
}

async function storeData({ req, ResponseError }) {
  const { headers, body } = req
  const token = getToken(headers)
  let { roleName } = body

  if (token) {
    let insert = await User.create({
      roleName: roleName,
    })
    return { message: 'Data sudah ditambahkan', insert }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

async function updateData({ req, ResponseError }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  const id = params.id
  let { roleName } = body

  if (token) {
    let editData = await User.findByPk(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    let ObjDataUpdate = {
      roleName: roleName || editData.roleName,
    }
    await editData.update(ObjDataUpdate)
    return { message: 'Data berhasil diperbarui' }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

async function destroyData({ req, ResponseError }) {
  const { headers, params } = req
  const token = getToken(headers)
  const id = params.id

  if (token) {
    let checkData = await User.findByPk(id)
    if (!checkData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    await checkData.destroy()
    return { message: 'Data berhasil dihapus!' }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

module.exports = {
  getAll,
  getOne,
  storeData,
  updateData,
  destroyData,
}
