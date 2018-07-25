const MongoClient = require('mongodb').MongoClient
const autoIncrement = require('mongodb-autoincrement')


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

    addUser: (userData) => {
        console.log("inside add user db", userData)
        return new Promise( (resolve, reject) => {
            autoIncrement.getNextSequence(DBClient.database, "users", function (err, autoIndex) {
                var collection = DBClient.database.collection("users");
                collection.insertOne({
                        user_id: autoIndex,
                        ...userData
                    }, ((err, results) => {
                    if(err) {
                        reject(err);
                    }
                    console.log("result", results)
                    resolve(results);
                }));
            });
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
    getTrayUserMapping : (trayId) => {
        trayId = parseInt(trayId);
        return new Promise( (resolve, reject) => {
            DBClient.database.collection('tray_user_mapping').findOne( { 'tray_id': trayId }, (err, trayUserMapping) =>{
                if(err) return reject(err);
                resolve(trayUserMapping);
            })
        });
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
    getBowlQRReaderMapping : ( bowlId, qrReaderId ) => {
        bowlId = parseInt(bowlId) || -1;
        qrReaderId = parseInt(qrReaderId) || -1;

        return new Promise( (resolve,reject) => {
            DBClient.database.collection('bowl_qr_reader_mapping').findOne({ $or : [ { 'bowl_id': bowlId},{ 'qr_reader_id': qrReaderId } ] }, (err, mapping) => {
                if(err) return reject(err);
                resolve(mapping);
            })
        });
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
    getBowlItemMapping : (bowlId) => {
        bowlId = parseInt(bowlId) ;
        return new Promise( (resolve, reject) => {
            DBClient.database.collection( 'bowl_item_mapping' ).findOne( { 'bowl_id': bowlId } , (err, result) => {
                if(err) reject(err);
                resolve(result);
            } );
        });
    },
    setBowlItemMapping: ( bowlId, itemId ) => {
        bowlId = parseInt( bowlId );
        itemId = parseInt( itemId );

        return new Promise( ( resolve, reject ) => {
            DBClient.database.collection( 'bowl_item_mapping' ).findOne( { 'bowl_id': bowlId }, ( err, bowlItemMapping ) => {
                if ( err ) return reject( err );
                if ( bowlItemMapping ) {
                    return reject( new Error( 'Bowl Mapping Already Exist ' ) );
                }
                else {
                    DBClient.database.collection( 'bowl_item_mapping' ).insertOne( { 'bowl_id': bowlId, 'item_id': itemId, 'timestamp': new Date() }, ( err, response ) => {
                        if ( err ) return reject( err ); // retry logic can be implemented;
                        resolve( { 'status': 201 } )
                    });
                }
            } )
        } )
    },
    deleteBowlItemMapping: ( bowlId ) => {
        bowlId = parseInt( bowlId );

        return new Promise( ( resolve, reject ) => {
            DBClient.database.collection( 'bowl_item_mapping' ).findOne( { 'bowl_id': bowlId }, ( err, bowlItemMapping ) => {
                if ( err ) return reject( err );
                if ( !bowlItemMapping ) {
                    resolve( { 'status': 202 } )
                }
                else {
                    DBClient.database.collection( 'bowl_item_mapping' ).deleteOne( { 'bowl_id': bowlId }, ( err, obj ) => {
                        if ( err ) return reject( err );
                        resolve( { 'status': 202 } )
                    } )
                }
            } )
        } )
    },
    getItems: () => {
        return new Promise( ( resolve, reject ) => {
            DBClient.database.collection( 'items' ).find().toArray( ( err, results ) => {
                if ( err ) {
                    return reject( err );
                }
                resolve( results );
            } )
        } ) 
    },

    getItemById: (id) => {
        id = parseInt( id );
        return new Promise( ( resolve, reject ) => {
            DBClient.database.collection( 'items' ).findOne( { 'item_id': id }, ( err, item ) => {
                if ( err ) return reject( err );
                console.log(item);
                resolve( item );
            } )
        } ) 
    },

    upsertMealForUser : (mealId, userId, item) => {
        mealId = mealId;
        userId = parseInt(userId);
        return new Promise( (resolve, reject) => {
            DBClient.database.collection( 'meals' ).findOne( {'$and' : [ {'user_id': userId} , {'meal_id' : mealId} ] }, (err, meal) => {
                if(err) return reject(err);
                if(!meal) {
                    DBClient.database.collection( 'meals' ).insertOne( { 'user_id': userId, 'meal_id' : mealId, 'status': 'ACTIVE', 'items': [item]}, (err, result) => {
                        if(err) return reject(err);
                        resolve({status : 'ok'});
                    })
                } else {
                    var updatedItems = meal.items ;
                    updatedItems.push(item);
                    var newValues = { $set: {items: updatedItems } };
                    DBClient.database.collection( 'meals' ).updateOne( {'$and' : [ {'user_id': userId} , {'meal_id' : mealId} ] }, newValues, (err, result) =>{
                        if(err) return reject(err);
                        resolve({status : 'ok'});
                    } )
                }
            } )
        })

    },

    markMealComplete : (mealId, userId) => {
        mealId = mealId;
        userId = parseInt(userId);

        return new Promise( (resolve, reject) => {
            DBClient.database.collection( 'meals' ).findOne( {'$and' : [ {'user_id': userId} , {'meal_id' : mealId} ] }, (err, meal) => {
                if(err) return reject(err);
                if(!meal) {
                    return reject('No meal found')
                }
                DBClient.database.collection( 'meals' ).updateOne( {'$and' : [ {'user_id': userId} , {'meal_id' : mealId} ] }, { $set: { 'status' : 'COMPLETED' } }, (err, result) => {
                    if(err) reject(err);
                    resolve(result)
                } )
            });
        })
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



