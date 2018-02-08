/*!
 * group: 一个处理玩家群体信息模块（比如群聊、组队、工会、游戏房间等）
 * 的基类，方便将来各种扩展
 */
'use strict';

//group类，拥有相同id的user放入一个group中进行管理
class group {
    //构造函数
    constructor(groupId) {
        this._userArr = [];//
        this._maxMen = 10;
        this._id = groupId != null ? groupId : 0;//类中变量
    }
    //类中函数\
    pushUser(user) {
        var canPush = true;
        if (user == null){
            return -1;
        };
        for (var k in this._userArr) {
            var v = this._userArr[k];
            if (v === user){
                return k;
            }
        };
        if (this._userArr.length >= this._maxMen){
            return -2;
        }
        this._userArr.push(user);
        return true;
    }

    removeUser(user) {
        if (user == null){
            return -1;
        };
        for (var k in this._userArr) {
            var v = this._userArr[k];
            if (v === user){
                this._userArr.splice(k,1);
                return true;
            }
        };
        return -2;
    }
}

//groupEvent类，负责监听消息，并管理多个group的创建和消除
//并根据user的情况，将user放入相应的group中
class groupEvent {
    //构造函数
    constructor() {
        this._groupArr = [];//
    }
    //类中函数，负责对message消息的接收和处理
    initUser(user){
        if (user == null){
            return false;
        };
        return true;
    }

    setIdinUser(user,data){
        if (user == null){
            return false;
        };
        user._id = data;
        return true;
    }

    getIdinUser(user){
        if (user == null || user._id == null){
            return null;
        };
        return user._id;
    }

    getNewObj(data){
        return new group(data);
    }

    _pushObjtoGroup(user,data){
        if (this._groupArr[data] == null){
            this._groupArr[data] = this.getNewObj(data);
            this._groupArr[data].pushUser(user);
        }
        else{
            this._groupArr[data].pushUser(user);
        }
        return true;
    }

    _removeObjfromGroup(user,index){
        var v = this._groupArr[index];
        if (v != null){
            v.removeUser(user);
        }
        return true;
    }

    onConnection(user){
        if (user == null){
            return false;
        }
        this.initUser(user);
        return true;
    }

    onMessage(key,data,user) {
        if (user == null){
            return false;
        }
        //joinroom
        if (key == 'joinroom'){
            if (data == null){
                return false;
            }
            var _id = this.getIdinUser(user);
            if (_id != null && data != _id){
                //user原本有group的，加入新group前要从原地方先删除
                this._removeObjfromGroup(user,_id);
                this.setIdinUser(user,data);
                this._pushObjtoGroup(user,data);
            }
            else if (_id == null){
                //user没有加入过group
                this.setIdinUser(user,data);
                this._pushObjtoGroup(user,data);
            }
        }
    }

    onMessClose(user) {
        if (user == null){
            return false;
        }
        var _id = this.getIdinUser(user);
        if (_id != null){
            this._removeObjfromGroup(user,_id);
        }
    }
}
exports.Class = group;
exports.Event = groupEvent;