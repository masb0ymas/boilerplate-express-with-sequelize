import sQuery from 'sequelice-query'

function createSimpleMaster(modelMaster, modelValidation) {
  const getAll = async ({ req, ResponseError }) => {
    const condition = await sQuery.generate({
      req,
      model: modelMaster,
      configs: {
        optSort: {
          defaultValues: {
            createdAt: sQuery.Sort.DESC,
          },
        },
      },
    })

    const {
      include,
      queryFilter: where,
      querySort: order,
      includeCount,
    } = condition

    const data = await modelMaster.findAll({
      include,
      where,
      order,
    })

    const totalRow = await modelMaster.count({
      include: includeCount,
      where,
    })

    return { data, totalRow }
  }

  const getOne = async ({ req, ResponseError }) => {
    const { id } = req.params
    const data = await modelMaster.findOne({
      where: {
        id,
      },
    })

    if (!data) {
      throw new ResponseError('Data tidak ditemukan atau telah dihapus', 404)
    }

    return { data }
  }

  const create = async ({ req, ResponseError }) => {
    const { body } = req
    const rawFormData = { ...body }
    const formData = await modelValidation
      .getCreateSchema()
      .validate(rawFormData, {
        stripUnknown: true,
        abortEarly: false,
      })

    await modelMaster.create(formData)

    return { message: 'Data berhasil dibuat!' }
  }

  const update = async ({ req, ResponseError }) => {
    const { body, params } = req
    const rawFormData = { ...body, ...params }

    const { data } = await getOne({ req, ResponseError })

    const formData = await modelValidation
      .getUpdateSchema()
      .validate(rawFormData, {
        stripUnknown: true,
        abortEarly: false,
      })

    await data.update(formData)

    return { message: 'Data berhasil diupdate!' }
  }
  const destroy = async ({ req, ResponseError }) => {
    const { id } = req.params

    const data = await modelMaster.findByPk(id)
    if (!data) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }
    await data.destroy()
    return { message: 'Data berhasil dihapus!' }
  }

  return {
    getOne,
    getAll,
    create,
    destroy,
    update,
  }
}

module.exports = createSimpleMaster
