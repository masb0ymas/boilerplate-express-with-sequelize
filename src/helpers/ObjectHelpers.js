const { cloneDeep } = require('lodash');

function assignExceptUndefined(target, source) {
  let filteredObj = {};
  if (source) {
    const entriesSource = Object.entries(cloneDeep(source));
    filteredObj = entriesSource.reduce((acc, curVal) => {
      const [field, value] = curVal;
      if (value !== undefined) {
        acc[field] = value;
      }
      return acc;
    }, {});
  }
  return Object.assign(target, filteredObj);
}

function assignAndValidate(targetObj, sourceObj, mvModelSchema) {
  const formData = assignExceptUndefined(targetObj, sourceObj);

  return mvModelSchema.validate(formData, {
    stripUnknown: true,
    abortEarly: false,
  });
}

// console.log(
//   assignExceptUndefined(
//     { nama: 'heya', replace: 'asli' },
//     { nama: undefined, replace: 'timpa' }
//   )
// )

module.exports = {
  assignExceptUndefined,
  assignAndValidate,
};
