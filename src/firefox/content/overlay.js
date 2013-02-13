var HelloWorld = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },

  onMenuItemCommand: function() {

    var email = "andrew.engwy@gmail.com";

    // var email = prompt('Please enter backpack email:');

    // if (!email) {
    //   return;
    // }

    Firebug.Console.log("FUCK THIS SHIT");

    var images = content.document.getElementsByTagName("img");

    for (var i = 0; i < images.length; i++) {
      Firebug.Console.log("img: "+ images[i].src);

      OpenBadges.Verifier.verify(email, images[i].src,
        function (assertion) {
          Firebug.Console.log('Verified: `' + assertion.badge.name + '`');

          // var tick = $('<img>');
          // tick.addClass('badge-result');
          // tick.css('top', img.y + 'px');
          // tick.css('left', img.x + 'px');
          // tick.css('position', 'absolute');
          // tick.css('width', img.width + 'px');
          // tick.css('height', img.height + 'px');
          // tick.attr('src', chrome.extension.getURL('/img/tick.png'));
          // $(document.body).append(tick);
        },
        function (error) {
          Firebug.Console.log(error);
          if (error === 'Not a badge.') {
            return;
          }

          // var cross = $('<img>');
          // cross.addClass('badge-result');
          // cross.css('top', img.y + 'px');
          // cross.css('left', img.x + 'px');
          // cross.css('position', 'absolute');
          // cross.css('width', img.width + 'px');
          // cross.css('height', img.height + 'px');
          // cross.attr('src', chrome.extension.getURL('/img/cross.png'));
          // $(document.body).append(cross);
        }
      );
    }

    // // $('.badge-result').remove();

    // // TODO: search css for urls in background styles too
    // $('img[src$=".png"]', content.document).each(function (index, img) {

    //   Firebug.Console.log("img: "+ img);

    //   OpenBadges.Verifier.verify(email, img.src,
    //     function (assertion) {
    //       console.log('Verified: `' + assertion.badge.name + '`');

    //       // var tick = $('<img>');
    //       // tick.addClass('badge-result');
    //       // tick.css('top', img.y + 'px');
    //       // tick.css('left', img.x + 'px');
    //       // tick.css('position', 'absolute');
    //       // tick.css('width', img.width + 'px');
    //       // tick.css('height', img.height + 'px');
    //       // tick.attr('src', chrome.extension.getURL('/img/tick.png'));
    //       // $(document.body).append(tick);
    //     },
    //     function (error) {
    //       console.log(error);
    //       if (error === 'Not a badge.') {
    //         return;
    //       }

    //       // var cross = $('<img>');
    //       // cross.addClass('badge-result');
    //       // cross.css('top', img.y + 'px');
    //       // cross.css('left', img.x + 'px');
    //       // cross.css('position', 'absolute');
    //       // cross.css('width', img.width + 'px');
    //       // cross.css('height', img.height + 'px');
    //       // cross.attr('src', chrome.extension.getURL('/img/cross.png'));
    //       // $(document.body).append(cross);
    //     }
    //   );
    // });
  }
};

window.addEventListener("load", function(e) { HelloWorld.onLoad(e); }, false); 
