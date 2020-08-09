import BaseResponse from './BaseResponse'

class BadRequest extends BaseResponse {
  constructor(message) {
    super(message, 400)
  }
}

export default BadRequest
