/*!
 * playerdata: 玩家数据类，每位玩家在连接成功后都会创建，
 * 登录成功后，会根据id获取数据库中的数据
 */
'use strict';

class playerdata {
    //构造函数
    constructor() {
        this.userid = "";//玩家在服务器中的唯一ID，初始为空
        this.keyword = Math.round(Math.random() * 10000000000).toString();
    }

    setUserId(uid) {
    	this.userid = uid;
    }

    getUserId() {
    	return this.userid;
    }

    getKeyWord() {
    	return this.keyword;
    }
}

class playerdataEvent {
    //构造函数
    constructor() {
        //
    }

    initUser(user){
        if (user == null || user.player != null){
            return false;
        };
        user.player = new playerdata();
        return true;
    }

    onConnection(user){
    	if (user == null){
            return false;
        }
        this.initUser(user);
        Global_SendMessage(user,'mobileId|14'+user.player.getKeyWord(),true);
        return true;
    }

	onMessage(key,data,user){
		if (user == null){
            return false;
        }
		if (key == 'login'){
			user.player.setUserId(data);
            // user.player.userid = data;
        }
	}

	onMessClose(user){
		//
	}

    onEvent(key,data,cb){
        return false;
    }
}

module.exports = playerdataEvent;