import BaseResponse from './BaseResponse'

class Forbidden extends BaseResponse {
  constructor(message) {
    super(message, 403)
  }
}

export default Forbidden
