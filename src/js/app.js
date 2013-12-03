"use strict";

/*global require:false, document:false*/

require.config({
	paths: {
		"jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.2/jquery.min",
		"bootstrap": "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.2/js/bootstrap.min",
		"underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min",
		"backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min"
	},
	shim: {
		"bootstrap": {
			deps: ["jquery"]
		},
		"underscore": {
			exports: "_"
		},
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});

/**
 * @file Game driver. Creates the game object and wires up the interface to respond to game state changes. It expects the following elements to be a part of the DOM.
 * @author Beau Burke <beau@filterswept.com>
 */

require(
	["jquery", "bootstrap", "classes"],
	function ($, bootstrap, classes) {
		$(document).ready(
			function () {
				var $surfaceTemplate = $("#surface_template"),
					$meowFactory = $("#meow_sound_effects"),
					game = new classes.HappycatGame($surfaceTemplate, $meowFactory),
					labelMap = [
						"bored",
						"alert",
						"playful",
						"happy",
						"excited",
						"over-excited",
						"annoyed",
						"angry",
						"ready to kill"
					],
					updateLabels = function () {
						var $label = $("#score_descriptor"),
							contents = labelMap[game.player.score] || labelMap[labelMap.length - 1];

						$label.text(contents + ".");

						if (game.player.score > 10) {
							$("#instructions").text("oh god how did this get here I am not good with computer");
						} else if (!game.player.isDefaultName()) {
							$("#instructions").text(game.player.name + ", please pet happycat.");
						} else {
							$("#instructions").text("Please pet happycat.");
						}
					};

				updateLabels();

				game.onPlayerChange = function (player) {
					updateLabels();

					if (player.score >= 1) {
						$("#pause_button").removeClass("disabled");
						game.start();
					}

					if (player.score >= labelMap.length) {
						game.addSurface();
					}
				};

				game.introduce = function () {
					var $introModal = $("#name_gather_modal").modal("show"),
						$nameInput = $introModal.find("#name_input"),
						$nameAcceptButton = $introModal.find("#name_accept_button"),
						changeHandler = function (evt) {
							if ($(this).val() !== "") {
								$nameAcceptButton.removeClass("disabled");
							} else {
								$nameAcceptButton.addClass("disabled");
							}
						};

					$nameInput.on("keyup", changeHandler);
					$nameInput.on("change", changeHandler);

					$nameAcceptButton.on(
						"click",
						function (evt) {
							game.namePlayer($nameInput.val());
							$introModal.modal("hide");
						}
					);
				};

				$("#pause_button").on(
					"click",
					function (evt) {
						if ($(this).hasClass("active")) {
							game.start();
						} else {
							game.pause();
						}
					}
				);

				$("#reset_button").on(
					"click",
					function (evt) {
						game.reset();
						updateLabels();
						$("#pause_button").addClass("disabled");
						$("#pause_button").removeClass("active");
					}
				);
			}
		);
	}
);
