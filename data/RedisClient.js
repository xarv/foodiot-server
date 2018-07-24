const redis = require("redis");

const RedisClient = {
    client : null,
    initialize : () => {
        RedisClient.client = redis.createClient();
    },

    set : (key, value) => {
        return new Promise( (resolve, reject) => {
            RedisClient.client.set(key, value, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        });
    },

    get : (key) => {
        return new Promise( (resolve, reject) => {
            RedisClient.client.get(key, (err, result) => {
                if(err)  {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            })
        })
    }

}

module.exports = RedisClient;