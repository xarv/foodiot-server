const redis = require("redis");

const RedisClient = {
    client : null,
    initialize : () => {
        RedisClient.client = redis.createClient();
    },

    set : (key, value) => {
        console.log(key);
        return new Promise( (resolve, reject) => {
            RedisClient.client.set(key, value, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        });
    },

    get : (key) => {
        console.log(key);
        return new Promise( (resolve, reject) => {
            RedisClient.client.get(key, (err, result) => {
                if(err)  {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            })
        })
    },

    delete : (key) => {
        return new Promise( (resolve, reject) => {
            RedisClient.client.del( key, (err, result) => {
                if(err) return reject(err);
                resolve(result);
            } )
        })
    }

}

module.exports = RedisClient;