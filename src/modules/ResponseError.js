// eslint-disable-next-line max-classes-per-file
class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

class NotFoundError extends ResponseError {
  constructor(message) {
    super(message, 404)
  }
}

class ForbiddenError extends ResponseError {
  constructor(message) {
    super(message, 403)
  }
}

class BadRequestError extends ResponseError {
  constructor(message) {
    super(message, 400)
  }
}

class UnauthorizedError extends ResponseError {
  constructor(message) {
    super(message, 401)
  }
}

module.exports = {
  ResponseError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
}
