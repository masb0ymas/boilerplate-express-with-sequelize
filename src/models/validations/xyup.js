/* eslint-disable max-classes-per-file */
const yup = require('yup')
const moment = require('moment')

function string(msgRequired, required = true) {
  let schema = yup.string()
  if (required) {
    schema = schema.required(msgRequired)
  }
  return schema
}

function number(msgRequired, required = true) {
  let schema = yup.number()
  if (required) {
    schema = schema.required(msgRequired)
  }
  return schema
}

function date(msgRequired, required = true) {
  let schema = yup.date()
  if (required) {
    schema = schema.required(msgRequired)
  }
  return schema
}

function id(msgInvalid, required = true) {
  let schema = number(msgInvalid, required)
  schema = schema.typeError(msgInvalid).min(1, msgInvalid)
  return schema
}

function uuid(msgInvalid, required = true) {
  let schema = yup.string()
  if (required) {
    schema = schema.required(msgInvalid)
  }
  schema = schema.typeError(msgInvalid)
  return schema
}

yup.addMethod(yup.string, 'errorsMessage', function(message, methods) {
  let custom = this
  const cMethods = methods || []
  for (let i = 0; i < cMethods.length; i += 1) {
    const method = cMethods[i]
    custom = custom[method](message)
  }
  return custom
})

class Mixed {
  static get When() {
    return {
      valueExist(keys, newSchema) {
        return [
          keys,
          (val, schema) => {
            return val ? newSchema : schema
          },
        ]
      },
    }
  }
}

class Date {
  static get Test() {
    return {
      isGreater(key, msg) {
        return [
          'is-greater',
          msg || `\${path} should be greater`,
          function(value) {
            return moment(value, 'HH:mm').isSameOrAfter(
              moment(this.parent[key], 'HH:mm')
            )
          },
        ]
      },
    }
  }

  static get When() {
    return {
      before(key, msg) {
        return [
          key,
          (st, schema) => {
            return schema.min(
              st,
              msg ||
                `\${path} field must be later than ${moment(st).format(
                  'DD-MM-YYYY'
                )}`
            )
          },
        ]
      },
    }
  }
}

module.exports = {
  id,
  uuid,
  string,
  number,
  date,
  Date,
  Mixed,
}
