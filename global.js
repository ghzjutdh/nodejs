/*!
 * global: 一个存放全局变量和对象的地方，
 * 原理是放到nodejs的global变量下
 * 
 * 为了实现模块化，降低系统的耦合性，应尽量避免全局变量
 *                                  ———— 沃兹基硕德
 */
'use strict';

// global.testVar = 'zgq';
// global.testObj = function(){
// 	return "zz";
// };

//经过测试 str 20个字符 pwd10个字符 运行10000编 耗时0.122秒
//         str 888个字符 pwd10个字符 运行10000编 耗时2.6秒
function encrypt(str, pwd) {
	if(pwd == null || pwd.length <= 0) {
	// alert("Please enter a password with which to encrypt the message.");
	return null;
	}
	str = escape(str);
	var prand = "";
	for(var i=0; i<pwd.length; i++) {
	prand += pwd.charCodeAt(i).toString();
	}
	var sPos = Math.floor(prand.length / 5);
	var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
	var incr = Math.ceil(pwd.length / 2);
	var modu = Math.pow(2, 31) - 1;
	if(mult < 2) {
	// alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
	return null;
	}
	var salt = Math.round(Math.random() * 1000000000) % 100000000;
	prand += salt;
	while(prand.length > 10) {
	prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	}
	prand = (mult * prand + incr) % modu;
	var enc_chr = "";
	var enc_str = "";
	for(var i=0; i<str.length; i++) {
	enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
	if(enc_chr < 16) {
	  enc_str += "0" + enc_chr.toString(16);
	} else enc_str += enc_chr.toString(16);
	prand = (mult * prand + incr) % modu;
	}
	salt = salt.toString(16);
	while(salt.length < 8)salt = "0" + salt;
	enc_str += salt;
	return enc_str;
}

function decrypt(str, pwd) {
	if(str == null || str.length < 8) {
	// alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
	return;
	}
	if(pwd == null || pwd.length <= 0) {
	// alert("Please enter a password with which to decrypt the message.");
	return;
	}
	var prand = "";
	for(var i=0; i<pwd.length; i++) {
	prand += pwd.charCodeAt(i).toString();
	}
	var sPos = Math.floor(prand.length / 5);
	var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
	var incr = Math.round(pwd.length / 2);
	var modu = Math.pow(2, 31) - 1;
	var salt = parseInt(str.substring(str.length - 8, str.length), 16);
	str = str.substring(0, str.length - 8);
	prand += salt;
	while(prand.length > 10) {
	prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	}
	prand = (mult * prand + incr) % modu;
	var enc_chr = "";
	var enc_str = "";
	for(var i=0; i<str.length; i+=2) {
	enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
	enc_str += String.fromCharCode(enc_chr);
	prand = (mult * prand + incr) % modu;
	}
	return unescape(enc_str);
}

function encryptKey(keyw){
    var key, data;
    var idx = keyw.indexOf("|");
    if (idx == -1) {
        key = keyw;
        data = null;
    }
    else {
        key = keyw.substr(0, idx);
        data = keyw.substr(idx + 1);
    }
    if (data.length != 12){
        return keyw;
    }
    var swap = [0,2,3,6,7,9,10,11];
    var dataarry = data.split("");
    for (var i = 0;i <= Math.floor(swap.length/2)-1;i=i+2){
        var v1 = swap[i];
        var v2 = swap[i+1];
        var temp = dataarry[v1];
        dataarry[v1] = dataarry[v2];
        dataarry[v2] = temp;
    }
    for (var i = dataarry.length - 1; i >= 1; i--) {
        dataarry[i-1] = (parseInt(dataarry[i],16)^parseInt(dataarry[i-1],16)).toString(16);
    };
    return key+"|"+dataarry.join("");
}

function decryptKey(keyw){
    var key, data;
    var idx = keyw.indexOf("|");
    if (idx == -1) {
        key = keyw;
        data = null;
    }
    else {
        key = keyw.substr(0, idx);
        data = keyw.substr(idx + 1);
    }
    if (data.length != 12){
        return keyw;
    }
    var dataarry = data.split("");
    for (var i = 0;i <= dataarry.length - 2; i++) {
        dataarry[i] = (parseInt(dataarry[i],16)^parseInt(dataarry[i+1],16)).toString(16);
    };
    var swap = [0,2,3,6,7,9,10,11];
    for (var i = 0;i <= Math.floor(swap.length/2)-1;i=i+2){
        var v1 = swap[i];
        var v2 = swap[i+1];
        var temp = dataarry[v1];
        dataarry[v1] = dataarry[v2];
        dataarry[v2] = temp;
    }
    return key+"|"+dataarry.join("");
}

global.Global_SendMessage = function(sender,mess,encryptkey){
	if (sender == null){
		return false;
	}
	if (encryptkey == true && sender.player != null){
		sender.send(encryptKey(mess));
	}
	else if (sender.player != null){
		sender.send(encrypt(mess,sender.player.getKeyWord()));
	}
	return true;
};

global.Global_RecvMessage = function(message,user){
	var key, data;
    if (user != null && user.player != null){
        message = decrypt(message,user.player.getKeyWord());
    }

    var idx = message.indexOf("|");
    if (idx == -1) {
        key = message;
        data = null;
    }
    else {
        key = message.substr(0, idx);
        data = message.substr(idx + 1);
    }
    return {key:key,data:data};
};
