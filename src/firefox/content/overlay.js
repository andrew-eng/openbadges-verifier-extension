/* global $, Firefox, prompt, Firebug, document, OpenBadges */

var OpenBadgesVerifier = {

  onLoad: function() {
    'use strict';
    this.initialized = true;
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

    var icon = $('<img>', window.content.document);
    icon.addClass('badge-result');
    icon.css('position', 'absolute');
    icon.css('top', iconTop + 'px');
    icon.css('left', iconLeft + 'px');
    icon.css('width', iconWidth + 'px');
    icon.css('height', iconWidth + 'px');
    icon.attr('src', iconSrc);
    $('body', window.content.document).append(icon);
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
