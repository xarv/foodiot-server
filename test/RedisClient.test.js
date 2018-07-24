var RedisClient = require('../data/RedisClient');

describe('test redis client', () => {

    beforeAll(() => {
        console.log('initializing redis client');
        RedisClient.initialize();
    } );

    it('should test initialization', () => {
        expect(RedisClient.client).toBeTruthy();
    });

    it('should set set key value in redis', () => {
        return RedisClient.set('key', 'value' ).then( result => {
            // console.log(result);
            expect(result).toEqual('OK');    
        })
    });

    it('should get value of key', () => {
        return RedisClient.get('key').then( result => {
            // console.log(result);
            expect(result).toEqual('value');
        })
    })
})