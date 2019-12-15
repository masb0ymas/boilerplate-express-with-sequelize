import sQuery from 'sequelice-query'
import models from '../models'
import { getToken } from '../helper'

// declare models
const { Role } = models

async function getAll({ req, ResponseError }) {
  const { query } = req
  let { page, pageSize } = query

  if (!page) page = 0
  if (!pageSize) pageSize = 10

  const including = []

  const condition = await sQuery.generate({
    req,
    model: Role,
    configs: {
      include: including,
    },
  })

  const data = await Role.findAll({
    include: condition.include,
    where: condition.queryFilter,
    offset: parseInt(pageSize) * parseInt(page),
    limit: parseInt(pageSize),
    order: condition.querySort,
  })

  const totalRow = await Role.count({
    include: condition.includeCount,
    where: condition.queryFilter,
  })

  return { data, totalRow }
}

async function getOne({ req, ResponseError }) {
  const { params } = req
  const { id } = params

  const including = []

  const data = await Role.findByPk(id, {
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
  const { roleName } = body

  if (token) {
    const insert = await Role.create({
      roleName,
    })
    return { message: 'Data sudah ditambahkan', insert }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

async function updateData({ req, ResponseError }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { id } = params
  const { roleName } = body

  if (token) {
    const editData = await Role.findByPk(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    const ObjDataUpdate = {
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
  const { id } = params

  if (token) {
    const checkData = await Role.findByPk(id)
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
