//建立server

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/play.html');
});
/*
app.get('/play.html', function(req, res){
	res.sendFile(__dirname + '/play.html');
});
*/
app.get('/full.html', function(req, res){
	res.sendFile(__dirname + '/full.html');
});
var user_count = 0;
var ghost;

//socket 事件
io.on('connection', function(socket){
	//var user_count = 0;
	//新user
	socket.on('add user',function(msg){
		socket.username = msg;
		console.log("new user:"+msg+" logged.");
		user_count = user_count+1;
		console.log(user_count);
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
	socket.on('click_button',function(val){

		socket.val = val;
		console.log(val);
		if(val == ghost){
			io.emit('gameover',{
				username:socket.username,
				val:socket.val
			})
		}else{
			io.emit('click_', {
				username:socket.username,
				val:socket.val
			});
		}
	});
	
	socket.on('gamestart', function(){
		var num = Math.floor((Math.random()*9)+1);
		ghost = parseInt(num);
		console.log('ghost='+ghost);
		io.emit('ghostready',ghost);
	});

	//left
	socket.on('disconnect',function(){
		console.log(socket.username+" left.");
		//user_count = user_count-1;
		//e.preventDefault();
		io.emit('user left',{
			username:socket.username
		});
	});


});

//指定port
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});