// windows main function
function initGame() {
	var keyboard = {
		_keydown: 0,
	}
	var stage = {
		_width: 898,
		_height: 512,
		background: 'images/background.png',
	}

	var player1_timer = new FrameTimer();
	var player2_timer = new FrameTimer();
     
	var player1 = new animObj({
		character: 'Ryu',
		active: '0',
		x: 230, 
		y: 370,
		stance: 'A',
		sprites: [
			{ name: 'A_Stance', w: 90, h: 140, frames: 10, time: 0.0485, padding: -14, x_offset: -6},
			{ name: 'A_Walk_F', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'A_Walk_B', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offseet: -14},
			{ name: 'A_HPunch_1', w: 160, h: 140, frames: 5, time: 0.075, padding: 0, x_offset: -20},
                        { name: 'B_Stance', w: 90, h: 140, frames: 10, time: 0.0485, padding: -14, x_offset: -5},
                        { name: 'B_Walk_F', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'B_Walk_B', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'B_HPunch_1', w: 160, h: 140, frames: 5, time: 0.075, padding: 0, x_offset: -62}

		],
	});
	
	var player2 = new animObj({ 
		character: 'Ken',
		active: '4',
		x: 570, 
		y: 370,
		stance: 'B',
		sprites: [
                        { name: 'A_Stance', w: 90, h: 140, frames: 10, time: 0.0485, padding: -14, x_offset: -6},
                        { name: 'A_Walk_F', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'A_Walk_B', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'A_HPunch_1', w: 160, h: 140, frames: 5, time: 0.075, padding: 0, x_offset: -20},
                        { name: 'B_Stance', w: 90, h: 140, frames: 10, time: 0.0485, padding: -14, x_offset: -5},
                        { name: 'B_Walk_F', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'B_Walk_B', w: 120, h: 140, frames: 11, time: 0.05, padding: -20, x_offset: -14},
                        { name: 'B_HPunch_1', w: 160, h: 140, frames: 5, time: 0.075, padding: 0, x_offset: -62}
		],
	});
	
    // Pre-load image sprites
    // Player 1
	player1._images = [];
	for (i in player1._sprites) {
			player1._images[i] = new Image();
			player1._images[i].src = "images/" + player1._character + "/" + player1._sprites[i].name + ".png";
	}

	// Player 2
        player2._images = [];
        for (i in player2._sprites) {
                        player2._images[i] = new Image();
                        player2._images[i].src = "images/" + player2._character + "/" + player2._sprites[i].name + ".png";
        }


	var fpsTimer = new gameTimer({
		fps: 60,
		run: function(){
			clearCanvas();
			player1.animate(player1_timer, player2.getCoords(), player2.getSpriteWidth(), stage);
			player2.animate(player2_timer, player1.getCoords(), player1.getSpriteWidth(), stage);
		}
	});
		
	// Create the key event hooks
	window.addEventListener('keydown', function (e) { keyDown(e, keyboard, player1, player2); }, true);
	window.addEventListener('keyup', function (e) { keyUp(e, keyboard, player1, player2); }, true);

	fpsTimer.start();
        
        socket.on('updateSprite', function(player, spriteIndex){
		if (player == 1) {
			player1._active = spriteIndex;
			player1._sprite = player1._sprites[player1._active];
			player1._frameIndex = 0;
			player1._frameDuration = player1._sprite.time;
		}
                if (player == 2) {
                        player2._active = spriteIndex;
                        player2._sprite = player2._sprites[player2._active];
                        player2._frameIndex = 0;
                        player2._frameDuration = player2._sprite.time;
                }
		
	});
	socket.on('resetkey', function(player, playerObj) { 
		if (playerObj._stance == "A") { 
			socket.emit('changeSprite', player, 0);
		}
		else {
                        socket.emit('changeSprite', player, 4);
		}
	});
}

// wipe that canvas
function clearCanvas() { 
	var ctx = document.getElementById('canvas').getContext('2d');
	ctx.clearRect(0, 0, 898, 512);
}
