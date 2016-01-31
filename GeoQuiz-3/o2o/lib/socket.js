var Cookie          = require('express/node_modules/cookie');
module.exports = function(app){
    var io = require('socket.io')(app);
    var sockets = {};
    var socketShops={};  //存储商家的socket
    var socketShopsName={};//存储所有商家的名字
    var socketShopsService={};
    var socketsTel={};
    io.use(function(socket,next){
        console.log('socket登录验证');
        var cookie =  Cookie.parse(socket.handshake.headers.cookie);
        if(!cookie.role) return next(new Error("登录失败！"));
        socket.role = cookie.role;
        if(cookie.role==1) {
            socket.name = cookie.name_s;
        }else{
            socket.name = cookie.name_u;
        }
        socket.service=cookie.service;
        socket.tel=cookie.tel;
        next();
    });
    //普通用户房间
    io.on('connection', function (socket) {
        var id   = socket.id,
            role = socket.role;

        if(role == 1){
            console.log('商家进入');
            socket.join('shop');
            console.log("商家名称："+socket.name) ;
            var user = io.sockets.adapter.rooms['user'];
            console.log(user);
            socketShops[id]=socket;
            socketShopsName[id]=socket.name;
            socketShopsService[id]=socket.service;
            socket.to('user').emit('message',{ cmd:'online',data: {id:id,name:socket.name,service:socket.service} });
        }else if(role == 2){
            console.log('用户进入');
            console.log("用户名称："+socket.name) ;
            socket.join('user');
            sockets[id]=socket;
            socketsTel[id]=socket.tel;
        }

        socket.on('message',function(packet){
            var sp = packet.cmd;
            switch(sp) {
                case "online":
                    socket.send({cmd:"list",data:{names:socketShopsName,services:socketShopsService}});
                    break;
                case "chat":
                    console.log("chat");
                    console.log(packet.data.tel);
                    socketShops[packet.data.id].send({cmd: "rec", data:{
                        id:id,message:packet.data.message,name:packet.data.name,tel:packet.data.tel}});
                    // sockets[packet.data.id].send({cmd: "rec", data: packet.data.message});
                    break;
                case "ok":
                    console.log("走到OK这里了");
                    console.log(packet.data.id);
                    sockets[packet.data.id].send({cmd:"ok",data:packet.data.message});
                    break;
            }
        });
        socket.on('disconnect',function(){
            delete socketShops[id];
            delete socketShopsName[id];
            delete sockets[id];
            delete socketsTel[id];
            delete socketShopsService[id] ;
            socket.to('user').emit('message',{ cmd:'list',data:{names:socketShopsName,services:socketShopsService}  });
        });
    });
};