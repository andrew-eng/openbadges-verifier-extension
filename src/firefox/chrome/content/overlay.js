/* global $, Firefox, prompt, Firebug, document, OpenBadges */

var hello = "YO";
var OpenBadgesVerifier = {

  onLoad: function() {
    // 'use strict';

    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("openbadgesverifier.");
    prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

    if (!prefs.setCharPref("firstRunDone")) {
      hello = "FIRST TIME";
      prefs.setCharPref("firstRunDone", "HELLO");
    } else{
      hello = "NOT FIRST TIME";
    }

    // hello = prefs.getCharPref("firstRunDone");
    // hello = "HELLO";
    // Firebug.Console.log(prefs);
    // this.firstRun = this.prefs.getCharPref("symbol").toUpperCase();
    // hello = "HELLO";

    // this.refreshInformation();    
    // window.setInterval(this.refreshInformation, 10*60*1000);

    // /**
    //  * Installs the toolbar button with the given ID into the given
    //  * toolbar, if it is not already present in the document.
    //  *
    //  * @param {string} toolbarId The ID of the toolbar to install to.
    //  * @param {string} id The ID of the button to install.
    //  * @param {string} afterId The ID of the element to insert after. @optional
    //  */
    // function installButton(toolbarId, id, afterId) {
    //     if (!document.getElementById(id)) {
    //         var toolbar = document.getElementById(toolbarId);
     
    //         // If no afterId is given, then append the item to the toolbar
    //         var before = null;
    //         if (afterId) {
    //             let elem = document.getElementById(afterId);
    //             if (elem && elem.parentNode == toolbar)
    //                 before = elem.nextElementSibling;
    //         }
     
    //         toolbar.insertItem(id, before);
    //         toolbar.setAttribute("currentset", toolbar.currentSet);
    //         document.persist(toolbar.id, "currentset");
     
    //         if (toolbarId == "addon-bar")
    //             toolbar.collapsed = false;
    //     }
    // }
    
    // let firstRunPref = "extensions.xulschoolhello.firstRunDone";
 
    // if (!Application.prefs.getValue(firstRunPref)) {
    //   installButton("addon-bar", "verify-button");
    //   // all the rest of the first run code goes here.
    // }

    // if (firstRun) {
    //     installButton("nav-bar", "my-extension-navbar-button");
    //     // The "addon-bar" is available since Firefox 4
    //     installButton("addon-bar", "my-extension-addon-bar-button");
    // }

    // this.initialized = true;
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

    var LIGHTBOX_CSS_SRC = "resource://openbadgesverifier_common/css/lightbox-style.css";
    var LIGHTBOX_HTML_SRC = 'resource://openbadgesverifier_common/html/lightbox.html';
    var SUCCESS_IMG_SRC = 'resource://openbadgesverifier_common/img/success.png';
    var FAILURE_IMG_SRC = 'resource://openbadgesverifier_common/img/failure.png';

    Firebug.Console.log(hello);
    
    var email = prompt('Please enter backpack email:');

    if (!email) {
      return;
    }

    $('.badge-result', window.content.document).remove();
    $('#openbadges-lightbox', window.content.document).remove();

    // TODO: search css for urls in background styles too
    // $('img[src$=".png"]', window.content.document).each(function (index, img) {

    //   OpenBadges.Verifier.verify(email, img.src,
    //     function (assertion) {
    //       Firebug.Console.log('Verified: `' + assertion.badge.name + '`');

    //       OpenBadgesVerifier.appendVerifiedIconToBadge(img, true);
    //     },
    //     function (error) {
    //       Firebug.Console.log(error);
    //       if (error === 'Not a badge.') {
    //         return;
    //       }
    //       OpenBadgesVerifier.appendVerifiedIconToBadge(img, false);
    //     }
    //   );
    // });

    var images = $.makeArray($('img[src$=".png"]', window.content.document));
    var success = 0;
    var badge_count = images.length;

    async.map(images,
      function (img, callback) {
        OpenBadges.Verifier.verify(email, img.src,
          function (assertion) {
            console.log('Verified: `' + assertion.badge.name + '`');

            OpenBadgesVerifier.appendVerifiedIconToBadge(img, true);

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

            OpenBadgesVerifier.appendVerifiedIconToBadge(img, false);

            callback();
          }
        );
      },
      function (error) {

        // Insert lightbox css file
        var lightboxStyleExist = $("link[href^='" + LIGHTBOX_CSS_SRC + "']", 
          window.content.document);

        if (!lightboxStyleExist.length) {
          var lightboxStyle = $("<link/>", window.content.document);
          lightboxStyle.attr("rel", "stylesheet");
          lightboxStyle.attr("type", "text/css");
          lightboxStyle.attr("href", LIGHTBOX_CSS_SRC);
          $('head', window.content.document).append(lightboxStyle);
        }
      
        // Get lightbox html
        var request = new XMLHttpRequest();
        request.open('GET', LIGHTBOX_HTML_SRC, false);
        request.send(null);
        if(request.status !== 0){
          throw("Lightbox html not found!");
        }

        var data = request.responseText;

        // Create jquery object and change some of the variables.
        var lightbox = $(data, window.content.document);
        lightbox.find('#email').text(email);
        lightbox.find('#success').text(success);
        lightbox.find('#failure').text(badge_count - success);
        lightbox.find('.success').css('background-image',
          "url(" + SUCCESS_IMG_SRC + ")");
        lightbox.find('.failure').css('background-image',
          "url(" + FAILURE_IMG_SRC + ")");

        lightbox.find('span.close, div.background').click(function () {
          lightbox.remove();
        });

        // Esc button closes lightbox
        function keyUp(event) {
          if (event.which === 27) {
            event.preventDefault();
            lightbox.remove();
            $(window.content.document).unbind('keyup', keyUp);
          }
        }
        $(window.content.document).keyup(keyUp);

        $('body', window.content.document).append(lightbox);
      }
    );
  }
};

window.addEventListener("load", function(e) { OpenBadgesVerifier.onLoad(); }, false); 
