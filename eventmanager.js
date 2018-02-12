/*!
 * 各个模块内部通信用
 * 类似与cocos2d中的cc.eventManager
 * 
 */
'use strict';

class eventManager {
    //构造函数
    constructor() {
        this._redisclient = null;//redis客户端对象
        this._delegets = [];//需要消息托管的模块
    }

    setRedisClient(rcli){
    	this._redisclient = rcli;
    }

    getRedisClient(rcli){
        return this._redisclient;
    }

    registDeleget(model){
    	this._delegets.push(model);
    }

	onEvent(key,data,cb){
		for (var k in this._delegets){
            var v = this._delegets[k];
            if (v.onEvent(key,data,cb) == true){
                return true;
            }
        }
        return false;
	}
}

module.exports = eventManager;