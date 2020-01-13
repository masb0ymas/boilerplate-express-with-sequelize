import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as yup from 'yup'
import passport from 'passport'
import 'dotenv/config'
import createDirNotExist from '#utils/Directory'
import models from '#models'
// import SendMailer from '#config/email'
import { ConstRoles } from '#constants'
import { getToken, getUniqueCodev2, validationRequest } from '#helper'

require('#config/passport')(passport)

const jwtPass = process.env.JWT_SECRET
// declare models
const { User, Role } = models

/*
  Create the main directory
  direktori akan dibikin otomatis ketika login,
  karna direktori ada yang menggunakan User ID
*/
async function createDirectory(userData) {
  const pathDirectory = [
    './public/uploads/csv',
    `./public/uploads/profile/${userData.id}`,
  ]

  pathDirectory.map(x => createDirNotExist(x))
}

async function signUp({ req, ResponseError }) {
  const { body } = req
  const { fullName, email, password, phone } = body

  const generateToken = {
    code: getUniqueCodev2(),
  }

  const tokenVerify = jwt.sign(
    JSON.parse(JSON.stringify(generateToken)),
    jwtPass,
    {
      expiresIn: 86400 * 1,
    }
  ) // 1 Days

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
  })

  await schema.validate(body)

  const ObjUser = {
    fullName,
    email,
    password,
    phone,
    RoleId: ConstRoles.ID_UMUM,
    tokenVerify,
  }

  const userData = await User.create(ObjUser)

  /*
    Example for sending email
    fungsi SendMailer cuma mengirim params / argument yg dibutuhkan utk
    menggunakan Node Mailer
  */

  // const htmlTemplate = 'signUpTemplate.html'
  // const objData = {
  //   fullName,
  //   token: tokenVerify,
  // }
  // const optMail = {
  //   emailTo: email,
  //   subject: 'Verifikasi Email',
  // }
  // SendMailer(htmlTemplate, objData, optMail)

  return {
    userData,
    message: 'Registrasi berhasil, Check email Anda untuk langkah selanjutnya!',
  }
}

async function signIn({ req, ResponseError }) {
  const { body } = req
  const { email, password } = body

  const including = [{ model: Role }]
  const condition = { email }

  const userData = await User.findOne({
    include: including,
    where: condition,
  })

  if (!userData) {
    throw new ResponseError('Data tidak ditemukan!', 404)
  }

  if (userData.active === true) {
    const checkPassword = await userData.comparePassword(password)
    if (checkPassword) {
      const token = jwt.sign(JSON.parse(JSON.stringify(userData)), jwtPass, {
        expiresIn: 86400 * 1,
      }) // 1 Days

      // create directory
      await createDirectory(userData)

      return {
        token: `JWT ${token}`,
        uid: userData.id,
        rid: userData.RoleId,
      }
    }
    // console.log(res)
    throw new ResponseError('Email atau Password salah!', 401)
  } else {
    throw new ResponseError(
      'Please check your email account to verify your email and continue the registration process.',
      401
    )
  }
}

async function getProfile({ req, ResponseError }) {
  const { headers } = req
  const token = getToken(headers)
  if (token) {
    return jwt.decode(token)
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

async function changePass({ req, ResponseError }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { id } = params
  const { currentPassword, password } = body

  if (token) {
    await validationRequest(body)

    const editData = await User.findById(id)
    if (!editData) {
      throw new ResponseError('Data tidak ditemukan!', 404)
    }

    if (bcrypt.compareSync(currentPassword, editData.password)) {
      const hashPassword = bcrypt.hashSync(password, 10)
      await editData.updateOne({
        password: hashPassword,
      })
    } else {
      throw new ResponseError('Password lama kamu salah!', 400)
    }

    return {
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }

  throw new ResponseError('Unauthorized. Please Re-login...', 403)
}

export { signUp, signIn, getProfile, changePass }
