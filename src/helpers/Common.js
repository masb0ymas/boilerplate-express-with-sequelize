/* eslint-disable no-useless-escape */
import fs from 'fs'

const invalidValues = [undefined, null, '', false]

// Generate Unique Code ( default length 32 )
function getUniqueCodev2(length = 32) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Get Token from headers
function getToken(headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
    return null
  }
  return null
}

// Read HTML File
function readHTMLFile(path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

const removeFileUpload = (pathDokumen) => {
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

export { getUniqueCodev2, getToken, readHTMLFile, removeFileUpload }
