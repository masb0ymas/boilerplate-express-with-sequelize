/* eslint-disable prefer-destructuring */
import multer from 'multer'
import path from 'path'

const sizeMb = 5

const limitField = 25 * 1024 * 1024
const limitSize = sizeMb * 1024 * 1024 // 5MB

function addUploadedFilesToReq(req) {
  const { multerFields } = req
  req.uploadedFiles = {}
  req.rawUploadedFiles = {}
  if (req.files) {
    for (let i = 0; i < multerFields.length; i += 1) {
      const field = multerFields[i]
      const files = req.files[field.name]
      // delete req body field name to prevent user input from body
      delete req.body[field.name]
      if (files) {
        if (field.maxCount > 1) {
          /*
            now you can access filename directly from req
            ex: req.uploadedFiles['fieldName'] = ['a.png', 'b.png']
            but still you can access raw files via rawUploadedFiles it's same like req.files
            but just make your code more readable
           */
          req.uploadedFiles[field.name] = files.map((x) => x.filename)
          req.rawUploadedFiles[field.name] = files
        } else {
          /*
            now you can access filename directly from req
            ex: req.uploadedFiles['fieldName'] = a.png
            but still you can access raw files via rawUploadedFiles with object not array
            because you set maxCount to 1
           */
          req.uploadedFiles[field.name] = files[0].filename
          req.rawUploadedFiles[field.name] = files[0]
        }
      }
    }
  }
}

const setup = (
  diskStorageCfg,
  multerCfg,
  allowedExt = ['.png', '.jpg', '.jpeg', '.xlsx', '.xls']
) => {
  // Upload CSV
  const storageUpload = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './public/uploads/csv/')
    },
    filename(req, file, cb) {
      cb(null, `dokumen-${Date.now()}${path.extname(file.originalname)}`)
    },
    ...(diskStorageCfg || {}),
  })

  const configUpload = multer({
    storage: storageUpload,
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname)
      if (!allowedExt.includes(ext.toLowerCase())) {
        return cb(new Error(`Only ${allowedExt.join(', ')} ext are allowed`))
      }

      cb(null, true)
    },
    limits: {
      fieldSize: limitField,
      fileSize: limitSize,
    },
    ...(multerCfg || {}),
  })

  return function uploadsField(fields) {
    const upload = configUpload.fields(fields)

    return function (req, res, next) {
      req.multerFields = fields
      upload(req, res, (err) => {
        addUploadedFilesToReq(req)
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(403).json({
              message: `Ukuran file terlalu besar, melebihi ${sizeMb} MB`,
            })
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res
              .status(403)
              .json({ message: 'Melebihi limit files upload' })
          }
          console.log(err)
          // formdata tipe file tidak memenuhi rules yg dibuat selain limit file
          return res
            .status(403)
            .json({ message: `${'Akses ditolak!'} ${err.message}` })
        }
        next()
      })
    }
  }
}

module.exports = {
  setup,
}
