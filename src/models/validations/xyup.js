/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
const yup = require('yup')
const moment = require('moment')

function CreateId(baseSchema, msgInvalid, required) {
  if (required) {
    baseSchema = baseSchema.required(msgInvalid)
  }
  baseSchema = baseSchema.typeError(msgInvalid)
  return baseSchema
}

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

function mixed(msgRequired, required = true) {
  let schema = yup.mixed()
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
  return CreateId(yup.number(), msgInvalid, required).min(1, msgInvalid)
}

function uuid(msgInvalid, required = true) {
  return CreateId(yup.string(), msgInvalid, required)
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
      valueEqual(keys, value, newSchema, options) {
        return [
          keys,
          {
            is: value,
            then: newSchema,
            ...(options || {}),
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

function generateFormSchema(getShapeSchema) {
  const getCreateSchema = function(language = 'id') {
    const shapeSchema = getShapeSchema(false, language)
    /*
     hapus id dari schema untuk menghindari id dibuat manual
     melalui API
    */
    shapeSchema.id = yup.mixed().strip()
    return yup.object().shape(shapeSchema)
  }

  const getDefaultSchema = function(language = 'id') {
    return yup.object().shape(getShapeSchema(false, language))
  }

  const getUpdateSchema = function(language = 'id') {
    return yup.object().shape(getShapeSchema(true, language))
  }

  return {
    getCreateSchema,
    getUpdateSchema,
    getDefaultSchema,
  }
}

module.exports = {
  id,
  uuid,
  string,
  number,
  date,
  mixed,
  Date,
  Mixed,
  generateFormSchema,
}
