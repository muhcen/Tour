const mongoose = require("mongoose");
const redis = require("redis").createClient("redis://127.0.0.1:6379");
const util = require("util");
redis.get = util.promisify(redis.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  this.useCache = true;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  console.log("I AM ABOUT TO RUN A QUERY");
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const casheValue = await redis.get(key);

  if (casheValue) {
    const doc = JSON.parse(casheValue);
    return Array.isArray(doc) === true
      ? doc.map((d) => JSON.parse(casheValue))
      : JSON.parse(casheValue);
  }

  const result = await exec.apply(this, arguments);
  redis.set(key, JSON.stringify(result), "EX", 20);
  return result;
};

module.exports = {
  clearCache: function (key) {
    clint.del(JSON.stringify(key));
  },
};
