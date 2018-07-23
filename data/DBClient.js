const MongoClient = require('mongodb').MongoClient

const DBClient = {
    database : null,
    initialize : () => {
        MongoClient.connect('mongodb://foodiot:foodiot91@ds020168.mlab.com:20168/foodiot', (err, database) => {
            // ... start the server
            if(err){
                throw err;
            }
            else {
                console.log(database.db);
                DBClient.database = database.db('foodiot');
            }
        })
    },

    getUsers : () => {
        return new Promise( (resolve, reject) => {
            DBClient.database.collection('users').find().toArray( (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            })
        }) 
    }

}

module.exports = DBClient;



