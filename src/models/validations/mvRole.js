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

module.exports = xyup.generateFormSchema(getShapeSchema)
