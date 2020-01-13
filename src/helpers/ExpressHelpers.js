/* eslint-disable no-use-before-define */
const { isObject, get } = require('lodash')
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
        createParams,
        createQuery,
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
        console.log('ERROR RESPONSE ERROR!!!')
        return res.status(e.statusCode).json(generateErrorResponseError(e))
      }
      if (e instanceof yup.ValidationError) {
        console.log('ERROR YUP VALIDATION!!!')
        return res.status(400).json(generateErrorYup(e))
      }
      if (e instanceof Sequelize.ValidationError) {
        console.log('ERROR SEQUELIZE VALIDATION!!!')
        return res.status(400).json(generateErrorSequelize(e))
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

function createParams(obj) {
  return {
    params: obj,
  }
}

function createQuery(obj) {
  return {
    query: obj,
  }
}

function generateErrorResponseError(e) {
  return isObject(e.message) ? e.message : { message: e.message }
}

function generateErrorYup(e) {
  return {
    message: e.errors.join('<br/>'),
    errors:
      e.inner.length > 0
        ? e.inner.reduce((acc, curVal) => {
            acc[curVal.path] = curVal.message
            return acc
          }, {})
        : { [e.path]: e.message },
  }
}

function generateErrorSequelize(e) {
  const errors = get(e, 'errors', [])
  const errorMessage = get(errors, '0.message', null)
  return {
    message: errorMessage ? `Validation error: ${errorMessage}` : e.message,
    errors: errors.reduce((acc, curVal) => {
      acc[curVal.path] = curVal.message
      return acc
    }, {}),
  }
}

class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}
