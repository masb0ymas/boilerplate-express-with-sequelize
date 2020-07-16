const filterValueByKey = (params) => {
  return ({ value }) => {
    let curValue = value || undefined
    if (params) {
      curValue = params
    }

    return curValue
  }
}

const filterBetweenByKey = (Op, params) => {
  return ({ value }) => {
    let curValue = value || undefined
    if (params) {
      curValue = {
        [Op.between]: [`${params} 00:00:00`, `${params} 23:59:59`],
      }
    }

    return curValue
  }
}

export { filterValueByKey, filterBetweenByKey }
