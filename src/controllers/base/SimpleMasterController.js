import sQuery from 'sequelice-query'
import { get } from 'lodash'
import { ObjectHelpers } from '#helpers'

function createSimpleMaster(modelMaster, modelValidation, options) {
  const { configGetAll, configGetOne, configCreate, configUpdate } =
    options || {}

  async function getAll({ req, ResponseError }) {
    const condition = await sQuery.generateWithPagination({
      req,
      model: modelMaster,
      configs: {
        optSort: {
          defaultValues: {
            createdAt: sQuery.Sort.DESC,
          },
        },
        ...configGetAll,
      },
    })

    const {
      include,
      queryFilter: where,
      querySort: order,
      includeCount,
      offset,
      limit,
    } = condition

    const data = await modelMaster.findAll({
      include,
      where,
      order,
      offset,
      limit,
    })

    const totalRow = await modelMaster.count({
      include: includeCount,
      where,
    })

    return { data, totalRow }
  }

  async function getOne({ req, ResponseError }) {
    const { id } = req.params
    const condition = await sQuery.generateWithPagination({
      req,
      model: modelMaster,
      configs: {
        optFilter: {
          defaultValues: {
            id,
          },
        },
        ...configGetOne,
      },
    })

    const { include, queryFilter: where, querySort: order } = condition

    const data = await modelMaster.findOne({
      include,
      where,
      order,
    })

    if (!data) {
      throw new ResponseError('Data tidak ditemukan atau telah dihapus', 404)
    }

    return { data }
  }

  async function create({ req, ResponseError }) {
    const { body } = req
    let rawFormData = { ...body }
    if (get(configCreate, 'getFormData', null)) {
      rawFormData = { ...(await configCreate.getFormData(req)) }
    }

    const formData = await modelValidation
      .getCreateSchema()
      .validate(rawFormData, {
        stripUnknown: true,
        abortEarly: false,
      })

    /* remove empty id */
    delete formData.id

    await modelMaster.create(formData)

    return { message: 'Data berhasil dibuat!' }
  }

  async function update({ req, ResponseError }) {
    const { body, params } = req
    let rawFormData = { ...body, ...params }
    if (get(configUpdate, 'getFormData', null)) {
      rawFormData = await configUpdate.getFormData(req)
    }

    const data = await modelMaster.findByPk(params.id)

    const formData = await ObjectHelpers.assignAndValidate(
      data.toJSON(),
      rawFormData,
      modelValidation.getUpdateSchema()
    )

    await data.update(formData)

    return { message: 'Data berhasil diupdate!' }
  }

  async function destroy({ req, ResponseError }) {
    const { id } = req.params

    const data = await modelMaster.findByPk(id)
    if (!data) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    await data.destroy()
    return { message: 'Data berhasil dihapus!' }
  }

  return {
    getAll,
    getOne,
    create,
    update,
    destroy,
  }
}

module.exports = createSimpleMaster
