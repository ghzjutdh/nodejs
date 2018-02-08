/*!
 * chatroom: 聊天房间
 * 的基类，方便将来各种扩展
 */
'use strict';
var group = require("./group.js");
var superClass = group.Class;
var superEvent = group.Event;
class chatroom extends superClass {
	//构造函数
    constructor(roomId) {
        super(roomId);
    }

    pushUser(user) {
    	super.pushUser(user);
    }

    removeUser(user) {
    	super.removeUser(user);
    }
}

class chatroomEvent extends superEvent {
	//构造函数
    constructor() {
        super();
    }
    //类中函数，负责对message消息的接收和处理
    initUser(user){
        if (user == null){
            return false;
        };
        user.room = {};
        return true;
    }

    setIdinUser(user,data){
        if (user == null){
            return false;
        };
        user.room.roomid = data;
        return true;
    }

    getIdinUser(user){
        if (user == null || user.room == null || user.room.roomid == null){
            return null;
        };
        return user.room.roomid;
    }

    getNewObj(data){
        return new chatroom(data);
    }

    onConnection(user){
    	super.onConnection(user);
    }

	onMessage(key,data,user){
		super.onMessage(key,data,user);
		if (user == null){
            return false;
        }
        //sendMsg
        if (key == 'sendMsg'){
        	var _roomid = this.getIdinUser(user);
        	if (this._groupArr[_roomid] == null){
        		return false;
        	}
        	for (var k in this._groupArr[_roomid]._userArr) {
        		var v = this._groupArr[_roomid]._userArr[k];
        		Global_SendMessage(v,'roomMsg|'+user.player.getUserId()+":"+data);
        	};
        }
	}

	onMessClose(user){
		super.onMessClose(user);
	}
}
exports.Class = chatroom;
exports.Event = chatroomEvent;