//Object constructors and prototypes
	  
var animObj = function(data) {
	this.load(data);
};
	  
animObj.prototype = {
	load: function(data) {
		this._character = data.character;
		this._sprites = data.sprites;
		this._active = data.active;
		this._x = data.x;
		this._y = data.y;
		this._frameIndex = 0;
		this._collision = 0;
		this._stance = data.stance;
		
		eval("this._sprite = this._sprites[" + this._active + "];");
		this._frameDuration = this._sprite.time;
	}
};
  
animObj.prototype.animate = function(timer, coords, width, stage) {
	this._deltaTime = timer.getSeconds();
	this._frameDuration -= this._deltaTime;
 
	var sx = this._frameIndex * this._sprite.w;
	var ctx = document.getElementById('canvas').getContext('2d');
	if (this._sprite.x_offset) { 
	        ctx.drawImage(this._images[this._active], sx, 0, this._sprite.w, this._sprite.h, this._x + this._sprite.x_offset, this._y, this._sprite.w, this._sprite.h);

	}
	else {
		ctx.drawImage(this._images[this._active], sx, 0, this._sprite.w, this._sprite.h, this._x, this._y, this._sprite.w, this._sprite.h); 
	}
	var opposingPlayer_x = coords[0];
	var opposingPlayer_w = width[0];
	var opposingPlayer_padding = width[1];
		
	//Boundary checking for walk animation
		
	if (this._sprite.name == "A_Walk_F") { 
		var thisBounds = (this._x + this._sprite.w) + this._sprite.padding;
		var opposingBounds = opposingPlayer_x - opposingPlayer_padding;
		if (thisBounds <= opposingBounds) { 
			if (this._frameIndex >= 1) { 
				if (this._character == "Ryu" || this._character == "Ken") { var dec = 3.5; }
				this._x = this._x + dec; 	 
			}			  
		}
		else { this._collision = 1; }
	}
	if (this._sprite.name == "B_Walk_F") { 
		var opposingBounds = (opposingPlayer_x + opposingPlayer_w) + opposingPlayer_padding;
		var thisBounds = this._x + this._sprite.padding;
		if (thisBounds >= opposingBounds) { 
			if (this._frameIndex >= 1) { 
				if (this._character == "Ryu" || this._character == "Ken") { var dec = 3.5; }
				this._x = this._x - dec; 		  
			}
		}
		else { this._collision = 1; }
	}
		
	if (this._sprite.name == "A_Walk_B") { 
		bound = this._sprite.padding * -1;
		if (this._frameIndex >= 1 && this._x > bound) { 
			if (this._character == "Ryu" || this._character == "Ken") { var dec = 2.5; }
			this._x = this._x - dec; 	 
		}			  
	}
	if (this._sprite.name == "B_Walk_B") {
		bound = stage._width - this._sprite.w - this._sprite.padding;
                if (this._frameIndex >= 1 && this._x < bound) {
                        if (this._character == "Ryu" || this._character == "Ken") { var dec = 2.5; }
                        this._x = this._x + dec;
                }
        }

    //draw animation
	if  (this._frameDuration <= 0) {
		this._frameIndex++;
		if (this._frameIndex == this._sprite.frames) {
			this._frameIndex = 0;
		}
		this._frameDuration = this._sprite.time;
	}
    
	// bump the tick
	timer.tick();
};

animObj.prototype.getCoords = function() { 
    var coords = [this._x, this._y];
    return coords;
};	  
animObj.prototype.getSpriteWidth = function() {
    var data = [this._sprites[this._active].w, this._sprites[this._active].padding];
	return data;
};
