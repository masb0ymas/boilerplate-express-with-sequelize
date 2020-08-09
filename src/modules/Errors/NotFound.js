import BaseResponse from './BaseResponse'

class NotFound extends BaseResponse {
  constructor(message) {
    super(message, 404)
  }
}

export default NotFound
