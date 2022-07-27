function keyDown(event,keyboard, player1, player2) {
	if (keyboard._keydown == 0) {
		if (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 80) { 
			keyboard._keydown = 1;
			socket.emit('keydown', event.keyCode, player1, player2);
		}

	}
}
function keyUp(event, keyboard, player1, player2) {
        if (keyboard._keydown == 1) {
		keyboard._keydown = 0;
                socket.emit('keyup', player1, player2);
	}
}
