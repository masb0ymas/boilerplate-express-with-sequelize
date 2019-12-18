import * as yup from 'yup'
import sQuery from 'sequelice-query'
import models from '#models'
import { getToken } from '#helper'

// declare models
const { User, Role } = models

async function getAll({ req, ResponseError }) {
  const { query } = req
  let { page, pageSize } = query

  if (!page) page = 0
  if (!pageSize) pageSize = 10

  const including = [{ model: Role }]

  const condition = await sQuery.generate({
    req,
    model: User,
    configs: {
      include: including,
    },
  })

  const data = await User.findAll({
    include: condition.include,
    where: condition.queryFilter,
    offset: parseInt(pageSize) * parseInt(page),
    limit: parseInt(pageSize),
    order: condition.querySort,
  })

  const totalRow = await User.count({
    include: condition.includeCount,
    where: condition.queryFilter,
  })

  return { data, totalRow }
}

async function getOne({ req, ResponseError }) {
  const { params } = req
  const { id } = params

  const including = []

  const data = await User.findByPk(id, {
    include: including,
  })
  if (!data) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }

  return { data }
}

async function storeData({ req, ResponseError }) {
  const { headers, body, files } = req
  const token = getToken(headers)
  const { fullName, email, password, phone, RoleId } = body

  console.log(files)

  if (token) {
    const schema = yup.object().shape({
      fullName: yup.string().required('nama lengkap belum diisi'),
      email: yup
        .string()
        .email()
        .required('email belum diisi'),
      password: yup
        .string()
        .min(8, 'password minimal 8 karakter')
        .required('password belum diisi'),
      Role: yup.string().required('role id belum diisi'),
    })

    await schema.validate(body)

    const insert = await User.create({
      fullName,
      email,
      password,
      phone,
      RoleId,
    })
    return { message: 'Data sudah ditambahkan', insert }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

async function updateData({ req, ResponseError }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { id } = params
  const { fullName, email, password, phone, RoleId, active } = body

  if (token) {
    const editData = await User.findByPk(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    const ObjDataUpdate = {
      fullName: fullName || editData.fullName,
      email: email || editData.email,
      password: password || editData.password,
      phone: phone || editData.phone,
      RoleId: RoleId || editData.RoleId,
      active,
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
    const deleteData = await User.findByPk(id)
    if (!deleteData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    await deleteData.destroy()
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
