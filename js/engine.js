// Object constructor for the game timer
function gameTimer(settings)
{
	this.settings = settings;
	this.timer = null;
	this.fps = settings.fps || 30;
	this.interval = Math.floor(1000/settings.fps);
	this.timeInit = null;	         
	return this;
}

// Prototype functions for the game timer (start, stop, run) 
gameTimer.prototype =
{  
	run: function()
	{
		var $this = this;
	         
		this.settings.run();
		this.timeInit += this.interval;
	 
		this.timer = setTimeout(
			function(){$this.run()},
			this.timeInit - (new Date).getTime()
		);
	},
	     
	start: function()
	{
		if(this.timer == null)
		{
			this.timeInit = (new Date).getTime();
			this.run();
		}
	},
	     
	stop: function()
	{
		clearTimeout(this.timer);
		this.timer = null;
	}
}

// Frame timer
var FrameTimer = function() {
	this._lastTick = (new Date()).getTime();
};
 
FrameTimer.prototype = {
	getSeconds: function() {
		var seconds = this._frameSpacing / 1000;
		if(isNaN(seconds)) {
			return 0;
		}
		return seconds;
	},
 
	tick: function() {
		var currentTick = (new Date()).getTime();
		this._frameSpacing = currentTick - this._lastTick;
		this._lastTick = currentTick;
	}
};
