/*!
 * redis模块
 * 别的自己体会
 * 
 */
'use strict';

var redis = require("redis");
var redisclient = redis.createClient(6379,"127.0.0.1");
redisclient.info(function(err,response){
    if (err == null){
        console.log("redis client connect success");
    }
    else{
        console.log(err);
    }
});

class redismanager {
    //构造函数
    constructor() {
        this._redisclient = redisclient;//redis客户端对象
    }

    getRedisClient(rcli){
        return this._redisclient;
    }

    set(key,value,cb){
        redis.set("key",value,function(err,response){
            cb && cb(err,response);
        });
    }

    get(key,cb){
        redis.get(key,function(err,response){
            cb && cb(err,response);
        });
    }
}

module.exports = redismanager;