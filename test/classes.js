var ClassesTest = TestCase("ClassesTest");

ClassesTest.prototype.testSurface = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template),
		testClick = false;

	assertNotNull(surface.$node);
	assertFalse(surface.$node.children("img").triggerHandler("dragstart"));
	surface.$node.trigger("click");
	surface.onClick = function () {
		testClick = true;
	};
	surface.$node.trigger("click");
	assertTrue(testClick);

	assertNotNull(surface.size);
	assertNotUndefined(surface.size.w);
	assertNotUndefined(surface.size.h);

	assertNotNull(surface.position);
	assertNotUndefined(surface.position.x);
	assertNotUndefined(surface.position.y);

	assertNotNull(surface.velocity);
	assertNotUndefined(surface.velocity.x);
	assertNotUndefined(surface.velocity.y);
};

ClassesTest.prototype.testSurfaceSetPosition = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	surface.setPosition({
		x: 100,
		y: 234
	});

	assertEquals(100, surface.position.x);
	assertEquals(234, surface.position.y);
	assertEquals(surface.position.x + "px", surface.$node.css("left"));
	assertEquals(surface.position.y + "px", surface.$node.css("top"));
};

ClassesTest.prototype.testSurfaceMove = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	surface.setPosition({
		x: 100,
		y: 234
	});
	
	surface.move({
		x: 123,
		y: -456
	});

	assertEquals(223, surface.position.x);
	assertEquals(-222, surface.position.y);
};

ClassesTest.prototype.testSetVelocity = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	surface.setVelocity({
		x: -100,
		y: 234
	});

	assertEquals(-100, surface.velocity.x);
	assertEquals(234, surface.velocity.y);	
};

ClassesTest.prototype.testAccellerate = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	surface.setVelocity({
		x: 100,
		y: 234
	});
	
	surface.accellerate({
		x: 123,
		y: -456
	});

	assertEquals(223, surface.velocity.x);
	assertEquals(-222, surface.velocity.y);
};

ClassesTest.prototype.testSurfaceIterate = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	/* basic tests */
	surface.setPosition({x: 100, y: 234});
	surface.setVelocity({x: -100, y: 100});
	surface.iterate({w: 1000, h: 1000});
	
	assertEquals(0, surface.position.x);
	assertEquals(334, surface.position.y);
	assertEquals(-100, surface.velocity.x);
	assertEquals(100, surface.velocity.y);
	assertEquals(surface.position.x + "px", surface.$node.css("left"));
	assertEquals(surface.position.y + "px", surface.$node.css("top"));

	/* check x bounce */
	surface.setPosition({x: 100, y: 0});
	surface.setVelocity({x: -150, y: 1});
	surface.iterate({w: 300, h: 300});	
	assertEquals(150, surface.velocity.x);
	assertEquals(1, surface.velocity.y);

	surface.setPosition({x: 100, y: 0});
	surface.setVelocity({x: 250, y: 1});
	surface.iterate({w: 300, h: 300});	
	assertEquals(-250, surface.velocity.x);
	assertEquals(1, surface.velocity.y);

	/* check y bounce */
	surface.setPosition({x: 0, y: 100});
	surface.setVelocity({x: 1, y: -150});
	surface.iterate({w: 300, h: 300});	
	assertEquals(1, surface.velocity.x);
	assertEquals(150, surface.velocity.y);

	surface.setPosition({x: 0, y: 100});
	surface.setVelocity({x: 1, y: 250});
	surface.iterate({w: 300, h: 300});	
	assertEquals(1, surface.velocity.x);
	assertEquals(-250, surface.velocity.y);
};

ClassesTest.prototype.testSurfaceUpdate = function () {
	var $template = $("<div class='click_surface'><img></div>"),
		surface = new Surface($template);

	$("body").append(surface.$node);

	surface.setPosition({x: -123, y: 456});
	assertEquals(surface.position.x + "px", surface.$node.css("left"));
	assertEquals(surface.position.y + "px", surface.$node.css("top"));
	assertEquals(surface.size.w + "px", surface.$node.css("width"));
	assertEquals(surface.size.h + "px", surface.$node.css("height"));
};

ClassesTest.prototype.testPlayer = function () {
	var player = new Player();

	player.wipeSave();
	player = new Player();
	assertEquals("Player", player.name);
	assertEquals(0, player.score);
};

ClassesTest.prototype.testPlayerIsDefaultName = function () {
	var player = new Player();

	player.wipeSave();
	player = new Player();
	assertTrue(player.isDefaultName());
	player.name = "Foo Bar";
	assertFalse(player.isDefaultName());
};

ClassesTest.prototype.testPlayerScorePoint = function () {
	var player = new Player()

	player.wipeSave();
	player = new Player();
	assertEquals(0, player.score);
	player.scorePoint();
	assertEquals(1, player.score);
};

ClassesTest.prototype.testPlayerSave = function () {
	var player = new Player();

	/* where does it go?  we don't care!  we just don't want it
	   to throw an exception */
	player.save();
};

ClassesTest.prototype.testPlayerLoad = function () {
	var player = new Player();

	player.name = "Foo Bar";
	player.score = 23;
	player.save();

	player = new Player();
	player.load();
	assertEquals("Foo Bar", player.name);
	assertEquals(23, player.score);
};

ClassesTest.prototype.testPlayerWipeSave = function () {
	var player = new Player();

	player.name = "Foo Bar";
	player.score = 23;
	player.save();
	player.wipeSave();

	player = new Player();
	player.load();
	assertEquals("Player", player.name);
	assertEquals(0, player.score);
};

ClassesTest.prototype.testSampler = function () {
	var $audio = $("<div><audio></div>"),
		sampler = new Sampler($audio);

	assertNotNull(sampler.$samples);
	assertNotUndefined(sampler.$samples);
};

ClassesTest.prototype.testSamplerPlayRandom = function () {
	var $audio = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		sampler = new Sampler($audio);

	/* js-test-driver is breaking the audio download, likely because it's not giving away
	   the correct media type.  no file download means no meaningful tests here.  need
	   to investigate this more later.
	*/
	sampler.playRandom();
};

ClassesTest.prototype.testHappycatGame = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList),
		fieldBackup = {w: 0, h: 0};

	assertNotNull(game.player);
	assertNotUndefined(game.player);
	assertNotNull(game.soundEffects);
	assertNotUndefined(game.soundEffects);
	assertNotNull(game.surfaces);
	assertNotUndefined(game.surfaces);
	assertNotNull(game.field);
	assertNotUndefined(game.field);

	fieldBackup.w = game.field.w;
	fieldBackup.h = game.field.h;
	game.field.w = 0;
	game.field.h = 0;
	$(window).trigger("resize");
	assertEquals(fieldBackup.w, game.field.w);
	assertEquals(fieldBackup.h, game.field.h);
};

ClassesTest.prototype.testHappycatGameTriggerPlayerChange = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList),
		called = false;

	game.triggerPlayerChange();
	game.onPlayerChange = function () {
		called = true;
	};
	game.triggerPlayerChange();
	assertTrue(called);
};

ClassesTest.prototype.testHappycatGameAddSurface = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList);

	assertUndefined(game.surfaces.next);
	game.addSurface();
	assertNotUndefined(game.surfaces.next);
	assertNotEquals(0, game.surfaces.velocity.x);
	assertNotEquals(0, game.surfaces.velocity.y);
	assertNotUndefined(game.surfaces.onClick);
	assertEquals(2, $("body").find(".click_surface").length);
};

ClassesTest.prototype.testHappycatGameNamePlayer = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList),
		called = false;

	game.player.wipeSave();
	game.player.load();
	game.onPlayerChange = function () {
		called = true;
	};

	game.namePlayer("Foo Bar");
	assertEquals("Foo Bar", game.player.name);
	assertEquals(0, game.player.score);
	assertTrue(called);
};

ClassesTest.prototype.testHappycatGameScorePoint = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList);

	game.player.wipeSave();
	game.player.load();
	assertEquals(0, game.player.score);
	game.scorePoint();
	assertEquals(1, game.player.score);
};

ClassesTest.prototype.testHappycatGameStart = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList),
		called = false;

	game.player.wipeSave();
	game.player.load();
	game.introduce = function () {
		game.player.name = "Foo Bar";
		called = true;
	};

	game.start();
	assertTrue(called);
	assertUndefined(game.timer);
	
	game.start();
	assertNotUndefined(game.timer);
};

ClassesTest.prototype.testHappycatGameReset = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList);

	game.player.wipeSave();
	game.player.name = "Foo Bar";
	game.player.score = 123;
	game.addSurface();
	game.addSurface();

	game.start();
	game.reset();
	assertEquals("Player", game.player.name);
	assertEquals(0, game.player.score);
	assertEquals(1, $(".click_surface").length);
};

ClassesTest.prototype.testHappycatGamePause = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList);

	game.player.wipeSave();
	game.player.name = "Foo Bar";
	game.start();
	game.pause();
	assertNull(game.timer);
};

ClassesTest.prototype.testHappycatGameIterate = function () {
	var $surfaceTemplate = $("<div class='click_surface'><img></div>"),
		$soundList = $("<audio preload><source src='/test/src/audio/meow.mp3' type='audio/mp3'></audio>"),
		game = new HappycatGame($surfaceTemplate, $soundList);

	game.surfaces.setPosition({x: 1, y: 2});
	game.surfaces.setVelocity({x: 5, y: 5});
	game.iterate();

	assertEquals(6, game.surfaces.position.x);
	assertEquals(7, game.surfaces.position.y);
};


