import multer from 'multer'
import path from 'path'

const sizeMb = 5

const limitField = 25 * 1024 * 1024
const limitSize = sizeMb * 1024 * 1024 // 5MB

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

    return function(req, res, next) {
      upload(req, res, err => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res
              .status(403)
              .json({ message: `Ukuran file terlalu besar, melebihi ${sizeMb} MB` })
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(403).json({ message: 'Melebihi limit files upload' })
          }
          console.log(err)
          // formdata tipe file tidak memenuhi rules yg dibuat selain limit file
          return res.status(403).json({ message: `${'Akses ditolak!'} ${err.message}` })
        }
        next()
      })
    }
  }
}

module.exports = {
  setup,
}
