const mongoose = require('mongoose');
const redis = require('redis').createClient('redis://127.0.0.1:6379');
const util = require('util');
redis.hget = util.promisify(redis.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (option = {}) {
    this.useCache = true;
    this.userId = JSON.stringify(option.id || '');
    console.log(this.userId);
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    console.log('I AM ABOUT TO RUN A QUERY');
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name,
        }),
    );

    const casheValue = await redis.hget(this.userId, key);

    if (casheValue) {
        const doc = JSON.parse(casheValue);
        return doc;
    }

    const result = await exec.apply(this, arguments);
    redis.hmset(this.userId, key, JSON.stringify(result), 'EX', 10);
    return result;
};

module.exports = {
    clearCache: function (key) {
        redis.del(JSON.stringify(key));
    },
};
