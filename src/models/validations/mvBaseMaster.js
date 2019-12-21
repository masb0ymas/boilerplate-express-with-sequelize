const yup = require('yup')
const xyup = require('./xyup')

const dict = {
  id: {
    required: {
      nama: 'Nama wajib diisi',
    },
  },
}

const getShapeSchema = (required, language) => {
  // Default Langauge Id (Indonesia)
  const msg = Object.assign(dict.id, dict[language])
  return {
    id: xyup.uuid('Invalid Id', required),
    nama: yup.string().required(msg.required.nama),
  }
}

const getCreateSchema = (language = 'id') => {
  return yup.object().shape(getShapeSchema(false, language))
}

const getUpdateSchema = (language = 'id') => {
  return yup.object().shape(getShapeSchema(true, language))
}

module.exports = {
  getCreateSchema,
  getUpdateSchema,
}
