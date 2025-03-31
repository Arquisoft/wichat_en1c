// @ts-check

function removeMongoDBFields(_doc, ret) {
  delete ret.user;
  delete ret._id;
  delete ret.__v;
  return ret;
}

module.exports = {
  removeMongoDBFields,
};
