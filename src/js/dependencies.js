"use strict";

/*global define:false*/

define(
	["jquery"],
	function ($) {
		return {
			/**
			 * This is the container element where we're going to stick all of
			 * our <audio> tag.  There's nothing really special about it, aside
			 * from it being hidden
			 */
			$sampler: $("#meow_sound_effects"),

			/**
			 * Audio tag template we'll use to build up our sample list. 
			 */
			$sampleTemplate: $("#meow_sound_effect_template"),

			/**
			 * This is the base URL we're using to retrieve sample info.
			 */
			soundURL: "catsounds"
		};
	}
);
