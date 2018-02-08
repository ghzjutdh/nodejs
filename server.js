// var http = require('http');

// http.createServer(function(request,response){
// 	// 发送 HTTP 头部 
// 	// HTTP 状态值: 200 : OK
// 	// 内容类型: text/plain
// 	response.writeHead(200,{'Content-Type':'text/plain'});
// 	// 发送响应数据 "Hello World"
// 	response.end('Hello World\n');
// }).listen(8888);

// var net = require('net');
// var server = net.createServer(function(socket) { //'connection' listener
//     console.log('server connected');
//     socket.on('end', function(a) {
//         console.log('server disconnected');
//     });
//     socket.on('data', function(a){
//         // socket.end('hello\r\n');
//         console.log('server data a=');
//     });
//     socket.on('mydata', function(a){
//         // socket.end('hello\r\n');
//         console.log('server mydata a='+a);
//     });
//     socket.on('connect', function(a){
//         // socket.end('hello\r\n');
//         console.log('server connect');
//     });
//     socket.on('close', function(a){
//         // socket.end('hello\r\n');
//         console.log('server close');
//     });
// });
// server.listen(8888, function() { //'listening' listener
//     console.log('server bound');
// });
require("./global.js");

var room = require("./group/chatroom.js").Event;
var roomManager = new room();
var playerdata = require("./playerdata/playerdata.js");
var playerManager = new playerdata();
var test = require("./test/test.js");
var testManager = new test();

var redis = require("redis");
redisclient = redis.createClient(6379,"127.0.0.1");
redisclient.info(function(err,response){
	if (err == null){
		console.log("redis client connect suc");
	}
	else{
		console.log(err);
	}
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888 });
wss.on('connection', function (ws) {
    console.log('client connected');
    // ws.player = {userid:"noname"};
    // ws.room = {};
    playerManager.onConnection(ws);
    roomManager.onConnection(ws);
    testManager.onConnection(ws);
    ws.on('message', function (message) {
        console.log(message);
        //解析数据
        var ret = Global_RecvMessage(message,ws);
        var key = ret.key;
        var data = ret.data;
        // var idx = message.indexOf("|");
        // var key, data;
        // if (idx == -1) {
        //     key = message;
        //     data = null;
        // }
        // else {
        //     key = message.substr(0, idx);
        //     data = message.substr(idx + 1);
        // }
    //     //保存数据
    //     if (key == 'testset'){
    //     	redisclient.set("test",data,function(err,response){
	   //      	if (err == null){
				// 	console.log("redis value set suc");
				// 	ws.send(key+'|suc');
				// }
				// else{
				// 	console.log(err);
				// 	ws.send(key+'|err');
				// }
	   //      });
    //     }
    //     //读取数据
    //     if (key == 'testget'){
    //     	redisclient.get("test",function(err,response){
	   //      	if (err == null){
				// 	console.log("redis value get suc");
				// 	ws.send(key+'|'+response);
				// }
				// else{
				// 	console.log(err);
				// 	ws.send(key+'|err');
				// }
	   //      });
    //     }
        testManager.onMessage(key,data,ws,redisclient);
        // //login
        // if (key == 'login'){
        //     ws.player.userid = data;
        // }
        playerManager.onMessage(key,data,ws);
        // //joinroom
        // if (key == 'joinroom'){
        //     ws.room.roomid = data;
        // }
        // //sendMsg
        // if (key == 'sendMsg'){
        //     wss.clients.forEach(function each(client) {  
        //         if (client.room.roomid == ws.room.roomid){
        //             client.send('roomMsg|'+ws.player.userid+":"+data);
        //         }
        //     });
        // }
        roomManager.onMessage(key,data,ws);
    });
    ws.on('close', function(close) {
        playerManager.onMessClose(ws);
        roomManager.onMessClose(ws);
        testManager.onMessClose(ws);
    });
});

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');