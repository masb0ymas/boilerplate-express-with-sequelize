/* eslint-disable no-useless-escape */
import fs from 'fs'

const invalidValues = [undefined, null, '', false]

const getUniqueCode = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

const getUniqueCodev2 = (length = 32) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
    return null
  }
  return null
}

const validationRequest = async params => {
  const { currentPassword, password, Phone } = params

  if (!invalidValues.includes(password)) {
    const passwordStrongRegex = password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
    )

    if (currentPassword === password) {
      throw new Error('Password baru tidak boleh sama dengan password lama!')
    }

    if (!passwordStrongRegex) {
      throw new Error(
        'Password harus ada 1 huruf kecil, 1 huruf besar, 1 angka, dan minimal 8 karakter'
      )
    }
  }

  if (!invalidValues.includes(Phone)) {
    const phoneRegex = Phone.match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,10}$/
    )

    if (!phoneRegex) {
      throw new Error(
        'Nomor telepon harus angka, dan minimal 10 digit, maksimal 15 digit!'
      )
    }
  }
}

const removeFileUpload = pathDokumen => {
  // check type of array
  if (Array.isArray(pathDokumen)) {
    for (let i = 0; i < pathDokumen.length; i += 1) {
      const pathDir = pathDokumen[i]

      const replaceDocument = pathDir.replace('/uploads', './public/uploads')
      console.log('Removing... ', replaceDocument)
      fs.unlinkSync(replaceDocument)
    }
  }

  // by default string
  if (!invalidValues.includes(pathDokumen)) {
    const replaceDocument = pathDokumen.replace('/uploads', './public/uploads')
    console.log('Removing... ', replaceDocument)
    fs.unlinkSync(replaceDocument)
  }
}

export {
  getUniqueCode,
  getUniqueCodev2,
  getToken,
  validationRequest,
  removeFileUpload,
}
