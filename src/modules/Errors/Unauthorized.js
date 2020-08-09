import BaseResponse from './BaseResponse'

class Unauthorized extends BaseResponse {
  constructor(message) {
    super(message, 401)
  }
}
export default Unauthorized
