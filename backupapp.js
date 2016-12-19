//建立server

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/play.html', function(req, res){
	res.sendFile(__dirname + '/play.html');
});

app.get('/full.html', function(req, res){
	res.sendFile(__dirname + '/full.html');
});
var user_count = 0;

//socket 事件
io.on('connection', function(socket){

	//新user
	socket.on('add user',function(msg){
		socket.username = msg;
		console.log("new user:"+msg+" logged.");
		user_count = user_count+1;
		if(user_count <= 3){
			io.emit('add user',{
				username: socket.username
			});
		}
		if(user_count > 3){
			io.emit('user fulled',{
				username: socket.username 
			});
		}
		
	});

	//監聽新訊息事件
	socket.on('chat message', function(msg){

		console.log(socket.username+":"+msg);

  		//發佈新訊息
		io.emit('chat message', {
			username:socket.username,
			msg:msg
		});
	});

	//left
	socket.on('disconnect',function(){
		console.log(socket.username+" left.");
		io.emit('user left',{
			username:socket.username
		});
	});


});

//指定port
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});