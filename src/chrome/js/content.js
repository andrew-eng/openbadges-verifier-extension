/*global $, chrome, prompt, console, document, OpenBadges */

(function () {
	'use strict';

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

		var email = prompt('Please enter backpack email:');

		if (!email) {
			return;
		}

		$('.badge-result').remove();

		// TODO: search css for urls in background styles too
		$('img[src$=".png"]').each(function (index, img) {

			OpenBadges.Verifier.verify(email, img.src,
				function (assertion) {
					console.log('Verified: `' + assertion.badge.name + '`');

					var tick = $('<img>');
					tick.addClass('badge-result');
					tick.css('top', img.y + 'px');
					tick.css('left', img.x + 'px');
					tick.css('position', 'absolute');
					tick.css('width', img.width + 'px');
					tick.css('height', img.height + 'px');
					tick.attr('src', chrome.extension.getURL('/common/img/tick.png'));
					$(document.body).append(tick);
				},
				function (error) {
					console.log(error);
					if (error === 'Not a badge.') {
						return;
					}

					var cross = $('<img>');
					cross.addClass('badge-result');
					cross.css('top', img.y + 'px');
					cross.css('left', img.x + 'px');
					cross.css('position', 'absolute');
					cross.css('width', img.width + 'px');
					cross.css('height', img.height + 'px');
					cross.attr('src', chrome.extension.getURL('/common/img/cross.png'));
					$(document.body).append(cross);
				}
			);
		});
	});

}());