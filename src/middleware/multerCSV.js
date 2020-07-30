import { MulterMiddleware } from 'helpers'

const setupMulterDoc = MulterMiddleware.setup(
  {
    destination(req, file, cb) {
      cb(null, './public/uploads/csv/')
    },
  },
  null,
  ['.csv', '.xls']
)

const multerCSV = setupMulterDoc([{ name: 'dokumen', maxCount: 1 }])

export default multerCSV
