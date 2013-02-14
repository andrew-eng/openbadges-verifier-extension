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

  onMenuItemCommand: function() {

    var tickImageSrc = 'resource://openbadgesverifier_common/img/tick.png';
    var crossImageSrc = 'resource://openbadgesverifier_common/img/cross.png';

    // var email = prompt('Please enter backpack email:');

    // if (!email) {
    //   return;
    // }

    var email = "andrew.engwy@gmail.com";

    $('.badge-result', window.content.document).remove();

    // TODO: search css for urls in background styles too
    $('img[src$=".png"]', window.content.document).each(function (index, img) {

      OpenBadges.Verifier.verify(email, img.src,
        function (assertion) {
          Firebug.Console.log('Verified: `' + assertion.badge.name + '`');

          var offset = $(img).offset();
          OpenBadgesVerifier.appendImageToBody(offset.top, offset.left,
            img.width, img.height, tickImageSrc);
        },
        function (error) {
          Firebug.Console.log(error);
          if (error === 'Not a badge.') {
            return;
          }

          OpenBadgesVerifier.appendImageToBody(offset.top, offset.left,
            img.width, img.height, tickImageSrc);
        }
      );
    });
  }
};

window.addEventListener("load", function(e) { OpenBadgesVerifier.onLoad(e); }, false); 
