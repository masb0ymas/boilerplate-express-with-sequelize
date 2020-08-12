import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import passport from 'passport'
import 'dotenv/config'
import createDirNotExist from 'utils/Directory'
import models from 'models'
import mvUser from 'models/validations/mvUser'
// import SendMailer from 'config/email'
import { getToken, getUniqueCodev2 } from 'helpers'

require('config/passport')(passport)

const jwtPass = process.env.JWT_SECRET
// declare models
const { User, Role } = models

const expiresToken = 86400 * 1 // 1 Days

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

  pathDirectory.map((x) => createDirNotExist(x))
}

async function signUp({ req, BaseResponse }) {
  const { body } = req

  const generateToken = {
    code: getUniqueCodev2(),
  }

  const tokenVerify = jwt.sign(
    JSON.parse(JSON.stringify(generateToken)),
    jwtPass,
    {
      expiresIn: expiresToken,
    }
  ) // 1 Days

  const rawFormData = { ...body }
  let formData = await mvUser.getCreateSchema().validate(rawFormData, {
    stripUnknown: true,
    abortEarly: false,
  })

  formData = { ...formData, tokenVerify }

  const data = await User.create(formData)

  return {
    data,
    message: 'Registrasi berhasil, Check email Anda untuk langkah selanjutnya!',
  }
}

async function signIn({ req, BaseResponse }) {
  const { body } = req
  const { email, password } = body

  const including = [{ model: Role }]
  const condition = { email }

  const userData = await User.scope('withPassword').findOne({
    include: including,
    where: condition,
  })

  if (!userData) {
    throw new BaseResponse('Data tidak ditemukan!', 404)
  }

  if (userData.active) {
    const checkPassword = await userData.comparePassword(password)
    if (checkPassword) {
      const userDataJson = userData.toJSON()
      delete userDataJson.password

      const token = jwt.sign(
        JSON.parse(JSON.stringify(userDataJson)),
        jwtPass,
        {
          expiresIn: expiresToken,
        }
      ) // 1 Days

      // create directory
      await createDirectory(userData)

      return {
        token: `JWT ${token}`,
        uid: userData.id,
        rid: userData.RoleId,
      }
    }
    // console.log(res)
    throw new BaseResponse('Email atau Password salah!', 401)
  } else {
    throw new BaseResponse(
      'Please check your email account to verify your email and continue the registration process.',
      401
    )
  }
}

async function verifyToken({ req, BaseResponse }) {
  return 'success'
}

async function getProfile({ req, BaseResponse }) {
  const { headers } = req
  const token = getToken(headers)
  if (token) {
    const decodeToken = jwt.decode(token)
    const including = [{ model: Role }]

    const dataUser = await User.findByPk(decodeToken.id, {
      include: including,
    })
    return { data: dataUser }
  }

  throw new BaseResponse('Unauthorized. Please Re-login...', 403)
}

async function changePass({ req, BaseResponse }) {
  const { headers, body, params } = req
  const token = getToken(headers)
  const { id } = params
  const { currentPassword, password } = body

  if (token) {
    const editData = await User.scope('withPassword').findById(id)
    if (!editData) {
      throw new BaseResponse('Data tidak ditemukan!', 404)
    }

    if (bcrypt.compareSync(currentPassword, editData.password)) {
      const hashPassword = bcrypt.hashSync(password, 10)
      await editData.updateOne({
        password: hashPassword,
      })
    } else {
      throw new BaseResponse('Password lama kamu salah!', 400)
    }

    return {
      message: 'Data berhasil diperbarui!',
      editData,
    }
  }

  throw new BaseResponse('Unauthorized. Please Re-login...', 403)
}

export { signUp, signIn, getProfile, changePass, verifyToken }
