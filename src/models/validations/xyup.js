/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
const yup = require('yup')
const moment = require('moment')
const { isFunction } = require('lodash')

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
            let curNewSchema = newSchema
            if (isFunction(newSchema)) {
              curNewSchema = newSchema(schema)
            }
            return val ? curNewSchema : schema
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
    const baseCompareDate = (
      fnName,
      key,
      errorMessage,
      options = {
        formatString: undefined,
        unitOfTime: 'second',
        name: 'is-greater',
        defaultErrorMessage: `\${path} should be same or greater`,
      },
    ) => {
      const { formatString, unitOfTime, defaultErrorMessage, name } = options
      return [
        name,
        errorMessage || defaultErrorMessage,
        function(value) {
          return moment(value, formatString)[fnName](
            moment(this.parent[key], formatString),
            unitOfTime,
          )
        },
      ]
    }

    return {
      // formatString: ex HH:mm

      shouldSameOrBefore(
        key,
        errorMessage,
        options = {
          formatString: undefined,
          unitOfTime: 'second',
        },
      ) {
        return baseCompareDate('isSameOrBefore', key, errorMessage, {
          ...options,
          name: 'shouldSameOrBefore',
          defaultErrorMessage: `\${path} should be same or less`,
        })
      },

      shouldSameOrAfter(
        key,
        errorMessage,
        options = {
          formatString: undefined,
          unitOfTime: 'second',
        },
      ) {
        return baseCompareDate('isSameOrAfter', key, errorMessage, {
          ...options,
          name: 'shouldSameOrAfter',
          defaultErrorMessage: `\${path} should be same or greater`,
        })
      }, //formatString: ex HH:mm

      shouldBefore(
        key,
        errorMessage,
        options = {
          formatString: undefined,
          unitOfTime: 'second',
        },
      ) {
        return baseCompareDate('isBefore', key, errorMessage, {
          ...options,
          name: 'shouldBefore',
          defaultErrorMessage: `\${path} should be less`,
        })
      },

      shouldAfter(
        key,
        errorMessage,
        options = {
          formatString: undefined,
          unitOfTime: 'second',
        },
      ) {
        return baseCompareDate('isAfter', key, errorMessage, {
          ...options,
          name: 'shouldAfter',
          defaultErrorMessage: `\${path} should be greater`,
        })
      },
    }
  }

  static get When() {
    return {
      before(key, errorMessage) {
        return [
          key,
          (st, schema) => {
            return schema.min(
              st,
              errorMessage ||
              `\${path} field must be later than ${moment(st).format(
                'DD-MM-YYYY',
              )}`,
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

class Type {
  static email(message) {
    return yup.string().email(message)
  }

  static phoneNumber(message) {
    return yup
      .string()
      .test('len', message, val => val && val.toString().length >= 8)
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
  Type,
  generateFormSchema,
}
