/* eslint-disable no-use-before-define */
const { isObject } = require('lodash')
const yup = require('yup')
const fs = require('fs')
const sequelize = require('sequelize')

exports.wrapperRequest = fn => {
  return async (req, res) => {
    try {
      const data = await fn({ req, ResponseError })
      return res.status(200).json(isObject(data) ? data : { data })
    } catch (e) {
      cleanMulterFiles(req)
      if (e instanceof ResponseError) {
        return res
          .status(e.statusCode)
          .json(isObject(e.message) ? e.message : { message: e.message })
      }
      if (e instanceof yup.ValidationError) {
        const errorData = {
          message: e.errors.join('<br/>'),
          errors: e.inner.reduce((acc, curVal) => {
            acc[curVal.path] = curVal.message
            return acc
          }, {}),
        }
        return res.status(400).json(errorData)
      }
      if (e instanceof sequelize.ValidationError) {
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

function cleanMulterFiles(req) {
  const { rawUploadedFiles } = req
  if (rawUploadedFiles) {
    const entriesFiles = Object.entries(rawUploadedFiles)
    for (let i = 0; i < entriesFiles.length; i++) {
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
