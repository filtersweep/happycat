var AppTest = TestCase("AppTest");

AppTest.prototype.test = function () {
	var contents = 0;

	assertNotUndefined(window.game);
	assertNotNull(window.game);
}
