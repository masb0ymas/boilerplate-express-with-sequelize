/* eslint-disable no-use-before-define */
import { isObject } from 'lodash'

exports.wrapperRequest = fn => {
  return async (req, res) => {
    try {
      const data = await fn({ req, ResponseError })
      return res.status(200).json(isObject(data) ? data : { data })
    } catch (e) {
      if (e instanceof ResponseError) {
        return res.status(e.statusCode).json({ message: e.message })
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
class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}
