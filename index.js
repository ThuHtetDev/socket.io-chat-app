const { dirname } = require('path');

// let app = require('express')();
// let http = require('http').Server(app);
// let https = require('https');
// let http = require('http');
// let io = require('socket.io')(http);
let sio = require('socket.io');

let fs = require('fs');
var sys = require('sys');
var app = require('express')();
var https = require('https');
var server = https.createServer({
    key: fs.readFileSync('mykey.key'),
    cert: fs.readFileSync('mycrt.crt'),
    requestCert: false,
    rejectUnauthorized: false
},app);
server.listen(3334,function(){
    console.log("Connected HTTP");
});

var io = require('socket.io').listen(server);

app.get('/',(req,res) => {
    res.sendFile( __dirname +'/index.html');
});

// http.listen(3000, () => {
//     console.log('connected done');
// });


io.on('connection',(socket) =>{
    console.log("serverconnection done");

    // @ Socket Server Listen the data which is emitted from client 1
    socket.on('chatmessage',(data) => {
        io.emit('chatmessage',"I received it thank you");
    });
    socket.on('disconnect',()=> {
        console.log("disconnected");
    });

    // Listen realtime event from client 1
    socket.on('realtime',(senderData) => {
        let receiverData = {
            message: senderData.message,
            type: 'receiver'
        }
        socket.broadcast.emit('realtime',receiverData);
    });
});