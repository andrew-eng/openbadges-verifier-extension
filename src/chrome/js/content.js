/*global $, chrome, prompt, console, document, OpenBadges */

(function () {
	'use strict';

	var REGEXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

		function appendVerifiedIconToBadge(badge, verified) {

	    var MIN_ICON_SIZE = 16;
	    var ICON_BADGE_SIZE_RATIO = 0.4;
	    var TICK_IMAGE_SRC = chrome.extension.getURL('/common/img/green_tick_128.png');
	    var CROSS_IMAGE_SRC = chrome.extension.getURL('/common/img/red_cross_128.png');

	    var iconWidth, iconTop, iconLeft, iconSrc;

	    // Calculate the size of the icon. Either a fraction of the badge size
	    // or a minimum size.
	    iconWidth = Math.min(badge.width, badge.height) * ICON_BADGE_SIZE_RATIO;
	    iconWidth = iconWidth < MIN_ICON_SIZE ? MIN_ICON_SIZE : iconWidth;

	    // Position the icon at the bottom right hand corner of the badge.
	    iconTop = badge.y + badge.height - iconWidth;
	    iconLeft = badge.x + badge.width - iconWidth;

	    if (verified == true) {
	      iconSrc = TICK_IMAGE_SRC;
	    } else {
	      iconSrc = CROSS_IMAGE_SRC;
	    }

	    // Append image to body
	    var icon = $('<img>');
	    icon.addClass('badge-result');
	    icon.css('position', 'absolute');
	    icon.css('top', iconTop + 'px');
	    icon.css('left', iconLeft + 'px');
	    icon.css('width', iconWidth + 'px');
	    icon.css('height', iconWidth + 'px');
	    icon.attr('src', iconSrc);
	    $(document.body).append(icon);
	  };

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

						appendVerifiedIconToBadge(img, true);

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

						appendVerifiedIconToBadge(img, false);

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