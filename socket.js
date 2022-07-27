
	var socket = io('http://jsfighter.tk:4200');

	function launchGame(){
		var player_tag = document.getElementById('tag_1').value;
		if (!player_tag) {
			alert('You need to enter a player name!');
		}
		else {
			$( ".container-1" ).fadeOut( "slow", function() {
				console.log("Fadeout Complete");
			});

			console.log('Creating new match....');
			socket.emit('newMatch', player_tag);
			socket.on('newMatch', function(matchID){
				console.log('Match ID = ' + matchID);
				$("#matchID_show").text('Your match ID is: #' + matchID);
	                        $( ".container-2" ).fadeIn( "slow", function() {
        	                        console.log("Fadein Complete");
                	        });

			});
		}
	}

        function connectGame() {

                var player_tag = document.getElementById('tag_2').value;
                var matchID = document.getElementById('matchID').value;
		
                socket.emit('joinMatch',
                        { player_tag: player_tag , matchID: matchID }
                );

        };

	socket.on('alert', function(msg){
		alert(msg);
	});
	socket.on('log', function(msg){
		console.log(msg);
	});

        socket.on('initiate', function() {

                $( "#loading_screens" ).fadeOut( "slow", function() {

			$( ".container-3" ).fadeIn( "slow", function() { });
			initGame();
		});
	});
	socket.on('kill', function() {
		$( ".container-3" ).fadeOut( "slow", function() {
	 		$( ".container-1" ).css('display', 'none');

			$("#matchID_show").text('Your opponent has disconnected!');
			$("#matchMsg").text('You will want to navigate back to the home page and launch a new game.');

	                $( "#loading_screens" ).fadeIn( "slow", function() { });
	                $( ".container-2" ).fadeIn( "slow", function() { });
		});
	});

