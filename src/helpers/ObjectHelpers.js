const { cloneDeep } = require('lodash')

function objAssignExceptUndefined(target, source) {
  let filteredObj = {}
  if (source) {
    const entriesSource = Object.entries(cloneDeep(source))
    filteredObj = entriesSource.reduce((acc, curVal) => {
      const [field, value] = curVal
      if (value !== undefined) {
        acc[field] = value
      }
      return acc
    }, {})
  }
  return Object.assign(target, filteredObj)
}

// console.log(
//   objAssignExceptUndefined(
//     { nama: 'heya', replace: 'asli' },
//     { nama: undefined, replace: 'timpa' },
//   ),
// )

module.exports = {
  objAssignExceptUndefined,
}
