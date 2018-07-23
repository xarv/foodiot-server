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
    },
    getUserByID : (id) => {
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('users').findOne({ 'user_id' : parseInt(id) }, (err, user) => {
                if(err) return reject(err);
                console.log(user);
                resolve(user);
            })
        }) 
    },
    getTrays : () => {
        return new Promise( (resolve, reject) => {
            DBClient.database.collection('trays').find().toArray( (err, results) => {
                if(err) return reject(err);
                resolve(results);
            })
        }) 
    },
    getTrayByID : (id) => {
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('trays').findOne({ 'tray_id' : parseInt(id) }, (err, tray) => {
                if(err) return reject(err);
                resolve(tray);
            })
        }) 
    },
    setTrayUserMapping : (trayId, userId) => {
        trayId = parseInt(trayId);
        userId = parseInt(userId);

        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('tray_user_mapping').findOne({ $or : [ { 'tray_id': trayId},{ 'user_id': userId } ] }, (err, trayUserMapping) => {
                if(err) return reject(err);
                if(trayUserMapping) {
                    return reject(new Error('Tray Mapping Already Exist'));
                }
                else{
                    DBClient.database.collection('tray_user_mapping').insertOne( { 'tray_id': trayId, 'user_id' : userId, 'timestamp': new Date() }, (err, response) => {
                        if(err) return reject(err); // retry logic can be implemented;
                        resolve({'status': 201})
                    });
                }
                
            })
        })
    }


}

module.exports = DBClient;



