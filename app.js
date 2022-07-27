// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var $ = require("jquery");

app.use(express.static(__dirname + '/bower_components'));  

app.get("/", function(req, res){
    res.sendFile(__dirname + '/game.html');
});
app.get("/contact-me", function(req, res){
    res.sendFile(__dirname + '/contact.html');
});


function endGame(id) {
	if (getPlayer(id)) { 
		var socketID = getPlayer(id).socket;
		io.sockets.sockets[socketID].emit('kill');

	}
}

function endMatch(matchID) {

        var len = 0;
        for(var i=0, len=matches.length; i<len; ++i ) {
                var match = matches[i];

                if(matchID == match.id){
                        matches.splice(i,1);
                        console.log('Match ID #' + match.id + ' has ended.');
                        break;
                }
        }
}

var players = [];
var matches = [];

var getMatch = function(id) {
	for (var j = 0; j < matches.length; j++){
		if (matches[j].id == id) {
			return matches[j];
		}
	}
}

var getPlayer = function(id) {
        for (var j = 0; j < players.length; j++){
                if (players[j].id == id) {
                        return players[j];
                }
        }
}


function getPlayerID(socketID) {
        for (var j = 0; j < players.length; j++){
                if (players[j].socket == socketID) {
                        return players[j].id;
                }
        }
}
function getMatchID(id) {
	return getPlayer(id).matchID;
}

function updatePos(id, player, coord, value) {
	var socketID = getPlayer(id).socket;
        io.sockets.sockets[socketID].emit('updatePos', player, coord, value);
}
function changeSprite(id, player, spriteIndex) {
        var socketID = getPlayer(id).socket;
        io.sockets.sockets[socketID].emit('updateSprite', player, spriteIndex);
}
function resetKey(id, player, playerObj) {
        var socketID = getPlayer(id).socket;
        io.sockets.sockets[socketID].emit('resetkey', player, playerObj);
}
io.on('connection', function(socket){

	socket.on('newMatch', function(player_tag){
		console.log(player_tag + ' is connecting via socket ' + socket.id);

		// Create new player object
		var player = new Object();
		player.id = Math.floor((Math.random() * 9999) + 1);
		player.socket = socket.id;
		player.tag = player_tag;
		player.ingame = 0;
		player.waiting = 1;

		// Create new match object
		var match = new Object();
		match.id = Math.floor((Math.random() * 9999) + 1);
		match.players = 1;
		match.player1 = player.id;
		match.player1_health = 100;

		match.round = 0; 
		match.waiting = 1;

		// Assign match ID
		player.matchID = match.id;

		console.log(player_tag + '\'\s match ID = ' + player.matchID);

		players.push(player);
		matches.push(match);			
		io.sockets.sockets[player.socket].emit('newMatch', player.matchID);
  	});
	socket.on('kill', function(data) {
		console.log("Ending");
	});

	socket.on('joinMatch', function(data){
		if (!getMatch(data.matchID)) {
			 io.sockets.sockets[socket.id].emit('alert', 'The provided match ID is incorrect.');			
		}
		
		else if (getMatch(data.matchID).waiting != 1) { 
			io.sockets.sockets[socket.id].emit('alert', 'This match has already started. You will need to start a new match.');
		}
 
		else {

			var player1 = getPlayer(getMatch(data.matchID).player1).socket;
			console.log(data.player_tag + ' is attempting to connect to match ID #' + data.matchID + ' vs ' + getPlayer(getMatch(data.matchID).player1).tag);			
			io.sockets.sockets[socket.id].emit('log', 'Connection successful!');
	
			// Create new player object
			var player = new Object();
			player.id = Math.floor((Math.random() * 9999) + 1);
			player.socket = socket.id;
			player.tag = data.player_tag;
			player.facing = 1;
			player.matchID = data.matchID;
			player.ingame = 1;
			player.opponent = getPlayer(getMatch(data.matchID).player1).id;

			players.push(player);

			// Update opponent info 
                        getPlayer(getMatch(data.matchID).player1).ingame = 1;
                        getPlayer(getMatch(data.matchID).player1).opponent = player.id;

			// Update general match info
                        getMatch(data.matchID).waiting = 0;
                        getMatch(data.matchID).players = 2;

			// Add player 2 info
                        getMatch(data.matchID).player2 = player.id;
			getMatch(data.matchID).player2_health = 100;

			io.sockets.sockets[player1].emit('initiate');
			io.sockets.sockets[socket.id].emit('initiate');
		}
	});

	socket.on('changeSprite', function(player, spriteIndex){
                var playerID = getPlayerID(socket.id);
                var matchID = getMatchID(playerID);
		changeSprite(getMatch(matchID).player1, player, spriteIndex);
		changeSprite(getMatch(matchID).player2, player, spriteIndex);

	});
	socket.on('keydown', function(key, player1, player2) {
                var playerID = getPlayerID(socket.id);
                var matchID = getMatchID(playerID);

                if (getMatch(matchID).player1 == playerID) {
			switch (key) {
				case 39: 
					if (player1._stance == "A") { newSprite = 1; }
					else { newSprite = 5; }
				break
				case 37: 
					if (player1._stance == "A") { newSprite = 2; }
					else { newSprite = 6; }
				break
				case 80: 
					if (player1._stance == "A") { newSprite = 3; }
					else { newSprite = 7; }
				break
			}
			changeSprite(getMatch(matchID).player1, 1, newSprite);
			changeSprite(getMatch(matchID).player2, 1, newSprite);

                }
                if (getMatch(matchID).player2 == playerID) {
                        switch (key) {
                                case 39:
                                        if (player2._stance == "A") { newSprite = 1; }
                                        else { newSprite = 6; }
                                break
                                case 37:
                                        if (player2._stance == "A") { newSprite = 2; }
                                        else { newSprite = 5; }
                                break
                                case 80:
                                        if (player2._stance == "A") { newSprite = 3; }
                                        else { newSprite = 7; }
                                break
                        }

                        changeSprite(getMatch(matchID).player1, 2, newSprite);
                        changeSprite(getMatch(matchID).player2, 2, newSprite);

                }

        });
	socket.on('keyup', function(player1, player2) {
                var playerID = getPlayerID(socket.id);
                var matchID = getMatchID(playerID);
                if (getMatch(matchID).player1 == playerID) {
			resetKey(getMatch(matchID).player1, 1, player1); 
                        resetKey(getMatch(matchID).player2, 1, player1);
		}
		else {
                        resetKey(getMatch(matchID).player1, 2, player2);
                        resetKey(getMatch(matchID).player2, 2, player2); 
		}
	});
	socket.on('disconnect', function() {
        
		var len = 0;
		for(var i=0, len=players.length; i<len; ++i ) {
			var p = players[i];

			if(p.socket == socket.id){
				if (p.ingame == 1) {
                                        endMatch(p.matchID);
					if ( getPlayer(p.opponent) ) {
						endGame(p.opponent);
					}
				}
				if (p.waiting == 1) {
					endMatch(p.matchID);
				}

				players.splice(i,1);
				console.log(p.tag + " has disconnected from socket " + p.socket);
				break;
			}
		}
	});

});

server.listen(4200);
console.log("Listening on port 4200");
