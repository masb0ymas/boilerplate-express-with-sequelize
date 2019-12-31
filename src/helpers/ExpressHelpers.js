/* eslint-disable no-use-before-define */
const { isObject } = require('lodash')
const yup = require('yup')
const fs = require('fs')
const { Sequelize, sequelize } = require('../models')

exports.wrapperRequest = fn => {
  return async (req, res) => {
    try {
      const buildTransaction = () => {
        return createTransaction(req)
      }

      const data = await fn({
        req,
        ResponseError,
        buildTransaction,
      })

      if (req.transaction) {
        console.log('Auto commit transaction...')
        await req.transaction.commit()
      }

      return res.status(200).json(isObject(data) ? data : { data })
    } catch (e) {
      cleanMulterFiles(req)

      if (req.transaction) {
        await req.transaction.rollback()
      }

      if (e instanceof ResponseError) {
        return res
          .status(e.statusCode)
          .json(isObject(e.message) ? e.message : { message: e.message })
      }

      if (e instanceof yup.ValidationError) {
        console.log('ERROR YUP VALIDATION!!!')
        const errorData = {
          message: e.errors.join('<br/>'),
          errors: e.inner.reduce((acc, curVal) => {
            acc[curVal.path] = curVal.message
            return acc
          }, {}),
        }
        return res.status(400).json(errorData)
      }

      if (e instanceof Sequelize.ValidationError) {
        console.log('ERROR SEQUELIZE VALIDATION!!!')
        return res.status(400).json({ message: e.message })
      }
      console.log(e)
      /*
			 lebih logic return status code 500 karena error memang tidak dihandle
			 dicontroller
			 */
      return res.status(500).json({ message: e.message })
    }
  }
}

async function createTransaction(req) {
  const transaction = await sequelize.transaction({
    isolationLevel: 'SERIALIZABLE',
  })
  req.transaction = transaction
  req.transaction.manualCommit = async () => {
    delete req.transaction
    await transaction.commit()
  }

  req.transaction.manualRollback = async () => {
    delete req.transaction
    await transaction.rollback()
  }
  return req.transaction
}

function cleanMulterFiles(req) {
  const { rawUploadedFiles } = req
  if (rawUploadedFiles) {
    const entriesFiles = Object.entries(rawUploadedFiles)
    for (let i = 0; i < entriesFiles.length; i += 1) {
      // eslint-disable-next-line no-unused-vars
      const [field, value] = entriesFiles[i]
      console.log('Removing... ', value.path)
      fs.unlinkSync(value.path)
    }
  }
}

class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}
