/*!
 * test: 测试类，这里保存了一个服务器的模板类以及使用方法，
 * 类中的函数都是将来所有新建类所必备的，即使仅仅是个空函数
 */
'use strict';

class test {
    //构造函数
    constructor() {
    }
}

class testEvent {
    //构造函数
    constructor() {
        //
    }

    onConnection(user){
    	// var test = testVar;
        // test = testObj();
    }

	onMessage(key,data,user,redis){
		if (user == null){
            return false;
        }
        var glrm = global.Global_RedisManager;
		//保存数据
        if (key == 'testset'){
            // redis.set("test",data,function(err,response){
            //     if (err == null){
            //         console.log("redis value set suc");
            //         Global_SendMessage(user,key+'|suc');
            //     }
            //     else{
            //         console.log(err);
            //         Global_SendMessage(user,key+'|err');
            //     }
            // });
            glrm.set("test",data,function(err,response){
                if (err == null){
                    console.log("redis value set suc");
                    Global_SendMessage(user,key+'|suc');
                }
                else{
                    console.log(err);
                    Global_SendMessage(user,key+'|err');
                }
            });
        }
        //读取数据
        if (key == 'testget'){
            // redis.get("test",function(err,response){
            //     if (err == null){
            //         console.log("redis value get suc");
            //         Global_SendMessage(user,key+'|'+response);
            //     }
            //     else{
            //         console.log(err);
            //         Global_SendMessage(user,key+'|err');
            //     }
            // });
            glrm.get("test",function(err,response){
                if (err == null){
                    console.log("redis value get suc");
                    Global_SendMessage(user,key+'|'+response);
                }
                else{
                    console.log(err);
                    Global_SendMessage(user,key+'|err');
                }
            });
        }
	}

	onMessClose(user){
		//
	}

    onEvent(key,data,cb){
        // if (key == ""){
        //     return true;//返回true 则截断改消息，意味着其它模块收不到
        // }
        return false;
    }
}

module.exports = testEvent;