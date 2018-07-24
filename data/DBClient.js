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
            DBClient.database.collection('tray_user_mapping').findOne({ $or : [ { 'tray_id': trayId}, { 'user_id': userId } ] }, (err, trayUserMapping) => {
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
    },
    deleteTrayUserMapping : (trayId) => {
        trayId = parseInt(trayId);

        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('tray_user_mapping').findOne( { 'tray_id': trayId }, (err, trayUserMapping) => {
                if(err) return reject(err);
                if(!trayUserMapping) {
                    resolve({ 'status' : 202})
                }
                else {
                    DBClient.database.collection('tray_user_mapping').deleteOne( { 'tray_id': trayId } , (err, obj) => {
                        if(err) return reject(err);
                        resolve({ 'status' : 202})
                    })
                }
            })
        }) 
    },
    getBowls : () => {
        return new Promise( (resolve, reject) => {
            DBClient.database.collection('bowls').find().toArray( (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            })
        }) 
    },

    getBowlById : (id) => {
        id = parseInt(id);
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('bowls').findOne({ 'bowl_id' : id }, (err, bowl) => {
                if(err) return reject(err);
                resolve(bowl);
            })
        }) 
    },

    getQRReaders : () => {
        return new Promise( (resolve, reject) => {
            DBClient.database.collection('qrReaders').find().toArray( (err, results) => {
                if(err) {
                    return reject(err);
                }
                resolve(results);
            })
        }) 
    },

    getQRReaderById : ( id ) => {
        id = parseInt(id);
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('qrReaders').findOne({ 'qr_reader_id' : id }, (err, bowl) => {
                if(err) return reject(err);
                resolve(bowl);
            })
        }) 
    },

    setBowlQRReaderMapping : ( bowlId, qrReaderId ) => {
        bowlId = parseInt(bowlId);
        qrReaderId = parseInt(qrReaderId);

        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('bowl_qr_reader_mapping').findOne({ $or : [ { 'bowl_id': bowlId},{ 'qr_reader_id': qrReaderId } ] }, (err, bowlReaderMapping) => {
                if(err) return reject(err);
                if(bowlReaderMapping) {
                    return reject(new Error('Bowl Mapping Already Exist'));
                }
                else{
                    DBClient.database.collection('bowl_qr_reader_mapping').insertOne( { 'bowl_id': bowlId, 'qr_reader_id' : qrReaderId, 'timestamp': new Date() }, (err, response) => {
                        if(err) return reject(err); // retry logic can be implemented;
                        resolve({'status': 201})
                    });
                }
                
            })
        })

    }, 

    deleteBowlQRReaderMapping : (bowlId) => {
        bowlId = parseInt(bowlId);

        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('bowl_qr_reader_mapping').findOne( { 'bowl_id': bowlId }, (err, bowlQRMapping) => {
                if(err) return reject(err);
                if(!bowlQRMapping) {
                    resolve( { 'status' : 202 } )
                }
                else {
                    DBClient.database.collection('bowl_qr_reader_mapping').deleteOne( { 'bowl_id': bowlId } , (err, obj) => {
                        if(err) return reject(err);
                        resolve( { 'status' : 202 } )
                    })
                }
            })
        }) 
    },
    setBowlItemMapping: ( bowlId, itemId ) => {
        bowlId = parseInt( bowlId );
        itemId = parseInt( itemId );

        return new Promise( ( resolve, reject ) => {
            DBClient.database.collection( 'bowl_item_mapping' ).findOne( { 'bowl_id': bowlId, 'itemId': { $ne: itemId } }, ( err, bowlItemMapping ) => {
                if ( err ) return reject( err );
                if ( bowlItemMapping ) {
                    return reject( new Error( 'Bowl Mapping Already Exist ' ) );
                }
                else {
                    DBClient.database.collection( 'bowl_item_mapping' ).insertOne( { 'bowl_id': bowlId, 'itemId': itemId, 'timestamp': new Date() }, ( err, response ) => {
                        if ( err ) return reject( err ); // retry logic can be implemented;
                        resolve( { 'status': 201 } )
                    });
                }
            } )
        } )
    },
    getBalance : (id) => {
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('wallet_balance').findOne({ 'user_id' : parseInt(id) }, (err, userBalance) => {
                if(err) return reject(err); 
                resolve(userBalance);
            })
        })
    },

    updateWalletTransactions : (walletTransaction) => {
      id = parseInt(walletTransaction.id);
      amount = parseDouble(walletTransaction.amount);
      type = parseInt(walletTransaction.type);

      return new Promise ( (resolve, reject) => {
        DBClient.database.collection('wallet_transactions').insertOne( { 'user_id': id, 'amount' : amount,"type" : type,"merchant_name":walletTransaction.merchantName, 'date': new Date() }, (err, response) => {
          if(err) return reject(err);
          resolve({'status': 201})
        });
      })
    },
    
    updateBalance : (id, updatedBalance) => {
        return new Promise ( (resolve, reject) => {
            DBClient.database.collection('wallet_balance').updateOne({'user_id': parseInt(id)}, {$set:{'balance': updatedBalance}}, function(err, result) {
                if(err) return reject(err);
                resolve(result);
            });            
        })
    }    

}

module.exports = DBClient;



