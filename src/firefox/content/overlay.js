/* global $, Firefox, prompt, Firebug, document, OpenBadges */

var OpenBadgesVerifier = {

  onLoad: function() {
    'use strict';
    this.initialized = true;
  },

  appendImageToBody : function(top, left, width, height, src) {
    var image = $('<img>', window.content.document);
    image.addClass('badge-result');
    image.css('position', 'absolute');
    image.css('top', top + 'px');
    image.css('left', left + 'px');
    image.css('width', width + 'px');
    image.css('height', height + 'px');
    image.attr('src', src);
    $('body', window.content.document).append(image);
  },

  appendVerifiedIconToBadge : function(badge, verified) {

    var MIN_ICON_SIZE = 16;
    var ICON_BADGE_SIZE_RATIO = 0.4;
    var TICK_IMAGE_SRC = 'resource://openbadgesverifier_common/img/green_tick_128.png';
    var CROSS_IMAGE_SRC = 'resource://openbadgesverifier_common/img/red_cross_128.png';

    var iconWidth, iconTop, iconLeft, iconSrc;
    var badgePos = $(badge).offset();

    // Calculate the size of the icon. Either a fraction of the badge size
    // or a minimum size.
    iconWidth = Math.min(badge.width, badge.height) * ICON_BADGE_SIZE_RATIO;
    iconWidth = iconWidth < MIN_ICON_SIZE ? MIN_ICON_SIZE : iconWidth;

    // Position the icon at the bottom right hand corner of the badge.
    iconTop = badgePos.top + badge.height - iconWidth;
    iconLeft = badgePos.left + badge.width - iconWidth;

    if (verified == true) {
      iconSrc = TICK_IMAGE_SRC;
    } else {
      iconSrc = CROSS_IMAGE_SRC;
    }

    OpenBadgesVerifier.appendImageToBody(iconTop, iconLeft, iconWidth, iconWidth,
      iconSrc);
  },

  onMenuItemCommand: function() {

    // var email = 'andrew.engwy@gmail.com';
    var email = prompt('Please enter backpack email:');

    if (!email) {
      return;
    }

    $('.badge-result', window.content.document).remove();

    // TODO: search css for urls in background styles too
    $('img[src$=".png"]', window.content.document).each(function (index, img) {

      OpenBadges.Verifier.verify(email, img.src,
        function (assertion) {
          Firebug.Console.log('Verified: `' + assertion.badge.name + '`');

          OpenBadgesVerifier.appendVerifiedIconToBadge(img, true);
        },
        function (error) {
          Firebug.Console.log(error);
          if (error === 'Not a badge.') {
            return;
          }
          OpenBadgesVerifier.appendVerifiedIconToBadge(img, false);
        }
      );
    });
  }
};

window.addEventListener("load", function(e) { OpenBadgesVerifier.onLoad(e); }, false); 
