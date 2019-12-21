const yup = require('yup')

function id(msgInvalid, required = true) {
  let schema = yup.number()
  if (required) {
    schema = schema.required(msgInvalid)
  }
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

module.exports = {
  id,
  uuid,
}
