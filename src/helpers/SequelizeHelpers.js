async function throwIfNotExist(model, id, message, options) {
  const curOptions = {
    where: {
      id,
    },
    ...(options || {}),
  };
  const data = await model.findOne({
    ...curOptions,
  });
  if (!data) {
    throw new Error(message);
  }
}

async function throwIfExist(model, id, message, options) {
  const curOptions = {
    where: {
      id,
    },
    ...(options || {}),
  };
  const data = await model.findOne({
    ...curOptions,
  });
  if (data) {
    throw new Error(message);
  }
}

module.exports = {
  throwIfNotExist,
  throwIfExist,
};
