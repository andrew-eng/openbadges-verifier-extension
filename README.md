# Open Badges Verifier

## Overview

A Chrome and Firefox Extension to verify Open Badges Infrastructure compliant digital badges.


## Setup

### Google Chrome

1. Clone this repo
2. Navigate to the [extensions page](chrome://extensions).
3. Make sure 'Developer mode' is checked.
4. Click on 'Load unpacked extension...' and select the project directory.

### Firefox

1. Clone this repo
2. Follow the instructions in the MDN ["Setting up an extension development environment"](https://developer.mozilla.org/en/Setting_up_extension_development_environment) article.


## Using

1. Navigate to web page containing badges.
2. Verify the badges.
  * Chrome: Click on Open Badges Verifier extension icon on the upper right-hand corner.
  * Firefox: Go to tools and click "Verify Badges!" or enable Open Badges Verifier toolbar button (View -> Toolbars -> Customize...)
3. When a prompt pops up, type the email to be verified for ownership of the badges.
4. Verified badges will have green ticks over them and failed ones have red crosses instead.

Suggestions for more natural ways to perform the verification required.
Currently, the extension only detects badges in \<img> tags.


## Lint

Install [jshint](http://www.jshint.com), an easy way is to use npm.

    sudo npm install -g jshint
    make lint


## Run tests

### Google Chrome

After loading extension,

1. Navigate to the [extensions page](chrome://extensions).
2. Make sure 'Developer mode' is checked.
3. Copy the ID under the extension name and navigate to...

###
    chrome-extension://<extension-id>/common/test/index.html

### Firefox

TODO

## Package for release

A zip archive will be created in build directory ready for submission. Tests are excluded from package.

    make firefox    // openbadges-verifier.xpi
    make chrome     // openbadges-verifier.zip
    make            // Both

## Libraries used
* https://github.com/jquery/qunit -- Unit testing
* https://github.com/jquery/jquery -- AJAX wrapper
* https://github.com/caolan/async -- Async utlities
* https://code.google.com/p/crypto-js -- SHA256 hash
* https://github.com/devongovett/png.js -- Reading tEXt chunk in PNG
