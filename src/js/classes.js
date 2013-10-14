"use strict";

/*global $:false, window:false*/

/**
 * @file Game classes used to build the happycat game.
 * @author Beau Burke <beau@filterswept.com>
 * @see HappycatGame
 * @see Player
 * @see Surface
 * @see Sampler
 */

/**
 * Represents the clickable surface the user interacts with.
 * @constructor
 * @param {jQuery} $template - Element used to display Surface objects.  The element should be block level and positionable.
 */

function Surface($template) {
	var surface = this;

	this.$node = $template.clone();
	this.size = {w: 200, h: 240};
	this.position = {x: 0, y: 0};
	this.velocity = {x: 0, y: 0};
	this.next = null;

	this.$node.attr("id", "");
	this.$node.css("display", "block");

	/* sometimes an accidental drag occurs when the user is clicking rapidly. this will
	 * prevent the default drag handler
	 */
	this.$node.children("img").on(
		"dragstart",
		function (evt) {
			return false;
		}
	);

	this.$node.on(
		"click",
		function (evt) {
			if (surface.onClick) {
				surface.onClick(evt);
			}
		}
	);

	this.update();
}

/**
 * Sets the position of the current Surface.  The origin is at the top/left of the play field and is inverted on the x-axis.
 * @param position.x {Number} - X coordinate to place the surface at.
 * @param position.y {Number} - Y coordinate to place the surface at.
 */

Surface.prototype.setPosition = function (position) {
	this.position.x = position.x;
	this.position.y = position.y;
	this.update();
};

/**
 * Changes the position of the current Surface.  The origin is at the top/left of the play field and is inverted on the x-axis.
 * @param position.x {Number} - Delta to add to the surface's X coordinate.
 * @param position.y {Number} - Delta to add to the surface's Y coordinate.
 */

Surface.prototype.move = function (delta) {
	this.position.x += delta.x;
	this.position.y += delta.y;
	this.update();
};

/**
 * Sets the velocity of the current Surface.
 * @param position.x {Number} - X trajectory of the velocity.
 * @param position.y {Number} - Y trajectory of the velocity.
 */

Surface.prototype.setVelocity = function (velocity) {
	this.velocity.x = velocity.x;
	this.velocity.y = velocity.y;
};

/**
 * Changes the velocity of the current Surface.
 * @param position.x {Number} - Delta to add to the surface's X trajectory.
 * @param position.y {Number} - Delta to add to the surface's Y trajectory.
 */

Surface.prototype.accellerate = function (delta) {
	this.velocity.x += delta.x;
	this.velocity.y += delta.y;
};

/**
 * This method is called each time the game engine iterates.  Surface objects should update their position based on their current velocity.
 * @param bounds.w {Number} - Width of the playing surface.
 * @param bounds.h {Number} - Height of the playing surface.
 */

Surface.prototype.iterate = function (bounds) {
	var newPosition = {
		x: this.position.x + this.velocity.x,
		y: this.position.y + this.velocity.y
	};

	if (newPosition.x < 0 || (newPosition.x + this.size.w) >= bounds.w) {
		this.velocity.x = -this.velocity.x;
	}

	if (newPosition.y < 0 || (newPosition.y + this.size.h) >= bounds.h) {
		this.velocity.y = -this.velocity.y;
	}

	this.move(this.velocity);
	this.update();
};

/**
 * A helper method that matches the object's DOM element with the object's internal state.
 */

Surface.prototype.update = function () {
	this.$node.css({
		left: this.position.x + "px",
		top: this.position.y + "px",
		width: this.size.w + "px",
		height: this.size.h + "px"
	});
};

/**
 * Represents the game player.
 * @constructor
 */

function Player() {
	this.load();
}

/**
 * Indicates whether the current object has the system default name.
 * @returns {Boolean} True if the player name has the system default value.  False if otherwise.
 */

Player.prototype.isDefaultName = function () {
	return this.name === "Player";
};

/**
 * Used to notify the player object that a point has been scored.
 */

Player.prototype.scorePoint = function () {
	this.score += 1;
};

/**
 * Saves the current player state.
 */

Player.prototype.save = function () {
	try {
		window.localStorage.setItem("scratch_player_name", this.name);
		window.localStorage.setItem("scratch_player_score", this.score);

	} catch (error) {
		window.document.cookies = "scratch_player_name=" + this.name;
		window.document.cookies = "scratch_player_score=" + this.score;
	}
};

/**
 * Loads the saved player state.  If no saved state can be found, then default values are used instead.
 */

Player.prototype.load = function () {
	var readCookie = null;

	try {
		this.name = window.localStorage.getItem("scratch_player_name") || "Player";
		this.score = parseInt(window.localStorage.getItem("scratch_player_score") || "0", 10);

	} catch (error) {
		readCookie = function (name) {
			/* thanks Scott Andrew! */
			var nameEQ = name + "=",
				ca = window.document.cookie.split(';'),
				i = 0,
				c = "";

			for (i = 0; i < ca.length; i += 1) {
				c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length, c.length);
				}
			}

			return null;
		};

		this.name = readCookie("scratch_player_name") || "Player";
		this.score = parseInt(readCookie("scratch_player_score") || "0", 10);
	}
};

/**
 * Erases the saved player state.
 */

Player.prototype.wipeSave = function () {
	try {
		window.localStorage.removeItem("scratch_player_name");
		window.localStorage.removeItem("scratch_player_score");

	} catch (error) {
		window.document.cookies = "scratch_player_name=";
		window.document.cookies = "scratch_player_score=";
	}
};

/**
 * Simple utility used to trigger sounds.  The $container object can be any element which contains <audio> elements in any structure.  Each sound to trigger should have it's own <audio> element.
 * @param {jQuery} $container - Bundle of audio elements used to trigger sounds.
 * @constructor
 */

function Sampler($container) {
	this.$samples = $container.find("audio");
}

/**
 * Plays a random sound, selected from the list of supplied <audio> elements.
 */

Sampler.prototype.playRandom = function () {
	var index = 0;

	if (this.$samples.length > 0) {
		index = Math.floor(Math.random() * this.$samples.length);

		if (this.$samples[index].play) {
			this.$samples[index].play();
		}
	}
};

/**
 * Encapsulates all the data and rules used to play the Happycat game.
 * @constructor
 * @param {jQuery} $surfaceTemplate - Element used to display Surface objects.
 * @param {jQuery} $soundEffects - Element used to build audio sample list.
 */

function HappycatGame($surfaceTemplate, $soundEffects) {
	var game = this;

	this.$surfaceTemplate = $surfaceTemplate;
	this.player = new Player();
	this.soundEffects = new Sampler($soundEffects);
	this.field = {
		w: $(window).width(),
		h: $(window).height()
	};

	$(window).on(
		"resize",
		function (evt) {
			game.field.w = $(this).width();
			game.field.h = $(this).height();
		}
	);

	this.addSurface();
}

/**
 * Used to fire the game's onPlayerChange() handler.
 */

HappycatGame.prototype.triggerPlayerChange = function () {
	if (this.onPlayerChange) {
		this.onPlayerChange(this.player);
	}
};

/**
 * Adds a new Surface object to the game.  The object is placed at the center of the playing field and has a random velocity.
 * @todo Dont assume <body> is the playing field.  It should be user-definable.
 */

HappycatGame.prototype.addSurface = function () {
	var game = this,
		surface = new Surface(this.$surfaceTemplate);

	surface.setPosition({
		x: Math.floor(this.field.w / 2 - surface.size.w / 2),
		y: Math.floor(this.field.h / 2 - surface.size.h / 2)
	});

	surface.setVelocity({
		x: Math.ceil((Math.random() * 3) * (Math.random() > 0.5) ? -1 : 1),
		y: Math.ceil((Math.random() * 3) * (Math.random() > 0.5) ? -1 : 1)
	});

	surface.onClick = function (evt) {
		game.scorePoint();
		game.triggerPlayerChange();
	};

	$("body").append(surface.$node);

	surface.next = this.surfaces;
	this.surfaces = surface;
};

/**
 * Change the name of the current player.  This will reset the player's score, as well as save the player state.
 * @param {String} name - Player's new name.
 */

HappycatGame.prototype.namePlayer = function (name) {
	this.player.name = name;
	this.player.score = 0;
	this.player.save();
	this.triggerPlayerChange();
};

/**
 * Called when a point is scored.  Plays a random sound effect when called, as well as accellerates all surfaces a small amount.
 */

HappycatGame.prototype.scorePoint = function () {
	var surfaceTemp = this.surfaces;

	this.player.scorePoint();
	this.soundEffects.playRandom();

	while (surfaceTemp) {
		if (Math.abs(surfaceTemp.velocity.x) <= 20 && Math.abs(surfaceTemp.velocity.y) <= 20) {
			surfaceTemp.accellerate({
				x: Math.floor(Math.random() * 2) * (surfaceTemp.velocity.x < 0) ? -1 : 1,
				y: Math.floor(Math.random() * 2) * (surfaceTemp.velocity.y < 0) ? -1 : 1
			});
		}
		surfaceTemp = surfaceTemp.next;
	}
};

/**
 * Starts the game.  If the player is unknown, then we'll call the introduce() method, if present.  The introduce method should gather necessary information and update the player object state.
 */

HappycatGame.prototype.start = function () {
	var game = this;

	if (this.player.isDefaultName()) {
		if (this.introduce) {
			this.introduce();
			return;
		}
	}

	if (!this.timer) {
		this.timer = window.setInterval(
			function () {
				game.iterate();
			},
			16 /* ~ 60fps */
		);
	}
};

/**
 * Resets the game state.  This wipes player information, removes all surfaces from the playing surface, then add a single new surface.
 */

HappycatGame.prototype.reset = function () {
	this.pause();
	this.player.wipeSave();
	this.player.load();

	while (this.surfaces) {
		this.surfaces.$node.remove();
		this.surfaces = this.surfaces.next;
	}

	this.addSurface();
};

/**
 * Pauses the game.  Pause has no effect on player or surface state.  It simply stops the game from iterating.
 */

HappycatGame.prototype.pause = function () {
	window.clearInterval(this.timer);
	this.timer = null;
};

/**
 * A single iteration of the game.  Invoked approximately 60 times per second.
 */

HappycatGame.prototype.iterate = function () {
	var surfaceTemp = this.surfaces;

	while (surfaceTemp) {
		surfaceTemp.iterate(this.field);
		surfaceTemp = surfaceTemp.next;
	}
};
