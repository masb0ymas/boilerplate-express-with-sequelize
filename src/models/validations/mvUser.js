const yup = require('yup');
const xyup = require('./xyup');

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
};

const getShapeSchema = (required, language) => {
  // Default Langauge Id (Indonesia)
  const msg = Object.assign(dict.id, dict[language]);
  return {
    id: xyup.uuid('Invalid Id', required),
    fullName: xyup.string(msg.required.fullName),
    email: xyup.string(msg.required.email).email(msg.email.email),
    phone: xyup.string(msg.required.phone),
    active: xyup.string(undefined, false),
    tokenVerify: xyup.string(undefined, false),
    newPassword: xyup
      .string(msg.required.newPassword, !required)
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
    confirmNewPassword: xyup
      .string(msg.required.confirmNewPassword, !required)
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
    RoleId: xyup.uuid(msg.required.RoleId),
  };
};

module.exports = xyup.generateFormSchema(getShapeSchema);
