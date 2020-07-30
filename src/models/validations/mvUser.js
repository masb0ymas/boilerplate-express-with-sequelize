import * as yup from 'yup'

const xyup = require('./xyup')

const dict = {
  id: {
    email: {
      email: 'Email tidak valid',
    },
    required: {
      fullName: 'Nama belum diisi',
      email: 'Email belum diisi',
      phone: 'nomor ponsel belum diisi',
      newPassword: 'Password belum diisi',
      confirmNewPassword: 'Konfirmasi Password belum diisi',
      RoleId: 'Role belum dipilih',
    },
  },
}

const getShapeSchema = (required, language) => {
  // Default Langauge Id (Indonesia)
  const msg = Object.assign(dict.id, dict[language])
  return {
    id: xyup.uuid('Invalid Id', required),
    fullName: yup.string().required(msg.required.fullName),
    email: yup.string().email(msg.email.email).required(msg.required.email),
    phone: yup.string().required(msg.required.phone),
    active: yup.string().nullable(),
    tokenVerify: yup.string().nullable(),
    newPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
    confirmNewPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
    RoleId: yup.string().required(msg.required.RoleId),
  }
}

module.exports = xyup.generateFormSchema(getShapeSchema)
