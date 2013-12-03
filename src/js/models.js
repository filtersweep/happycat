"use strict";

/*global define:false*/

define(
	["backbone", "underscore", "dependencies"],
	function (Backbone, _, dependencies) {
		var SoundEffect = null,
			SampleBank = null;

		SoundEffect = Backbone.Model.extend({
			urlBase: dependencies.soundURL,
			defaults: {
				name: "Empty sound",
				src: "#",
				type: "unknown"
			}
		});

		SampleBank = Backbone.Collection.extend({
			url: dependencies.soundURL,
			model: SoundEffect
		});

		return {
			SoundEffect: SoundEffect,
			SampleBank: SampleBank
		};
	}
);
