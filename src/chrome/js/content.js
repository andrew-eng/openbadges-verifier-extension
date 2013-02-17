/*global $, chrome, prompt, console, document, OpenBadges */

(function () {
	'use strict';

	var REGEXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

		var email = prompt('Please enter backpack email:');

		if (!email) {
			return;
		}

		// remove previous results if any
		$('.badge-result').remove();

		// TODO: search css for urls in background styles too
		/*
		$('*').each(function () {
			if ($(this).is('img')) {
				console.log(this.src);
			}

			var bg = $(this).css('background-image');
			if (/url\(/.test(bg)) {
				console.log(this);
			}
		});
		*/

		var images = $.makeArray($('img[src$=".png"]'));
		var success = 0;
		var badge_count = images.length;

		async.map(images,
			function (img, callback) {
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

						success++;
						callback();
					},
					function (error) {
						console.log(error);
						if (error === 'Not a badge.') {
							badge_count--;
							callback();
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

						callback();
					}
				);
			},
			function (error) {
				$.ajax({
					url: chrome.extension.getURL('/common/html/lightbox.html'),
					success: function (lightbox) {
						lightbox = $(lightbox);
						lightbox.find('#email').text(email);
						lightbox.find('#success').text(success);
						lightbox.find('#failure').text(badge_count - success);

						lightbox.find('span.close, div.background').click(function () {
							lightbox.remove();
						});

						// esc button closes lightbox
						function keyUp(event) {
							if (event.which === 27) {
								event.preventDefault();
								lightbox.remove();
								$(document).unbind('keyup', keyUp);
							}
						}
						$(document).keyup(keyUp);

						$(document.body).append(lightbox);
					}
				});
			}
		);
	});
}());