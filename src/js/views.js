"use strict";

/*global define:false*/

define(
	["backbone", "underscore", "jquery", "models", "dependencies"],
	function (Backbone, _, $, Models, dependencies) {
		var Sampler = Backbone.View.extend({
			el: dependencies.$sampler,

			initialize: function () {
				var self = this;

				this.rawSamples = new Models.SampleBank();
				this.sampleWidgets = [],
				this.template = _.template(dependencies.$sampleTemplate.html());
				this.rawSamples.fetch({
					success: function (collection, response, options) {
						self.render();
					},
					error: function (collection, response, options) {
						console.log(collection, response, options);
					}
				});
			},

			render: function () {
				var sampleTemp = null,
					markup = "",
					self = this;

				this.rawSamples.each(
					function (sample) {
						sampleTemp = $(self.template(sample.attributes));
						self.sampleWidgets.push(sampleTemp);
						self.$el.append(sampleTemp);
					}
				);
			},

			playRandom: function () {
				if (this.rawSamples.length > 0) {
					var randomIndex = Math.floor(Math.random() * this.rawSamples.length),
						sample = this.sampleWidgets[randomIndex];

					if (sample[0] && sample[0].play) {
						sample[0].play();
					}
				}
			}
		});

		return {
			Sampler: Sampler
		};
	}
);
