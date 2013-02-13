/*global $, PNG, CryptoJS */

var OpenBadges = (function (openBadges) {
	'use strict';

	function callback(c) {
		if (typeof c === 'function') {
			c.apply(undefined, Array.prototype.slice.call(arguments, 1));
		}
	}

	var REGEXP_URL = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
	var REGEXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var HASH = {
		'md5': CryptoJS.MD5,
		'sha256': CryptoJS.SHA256,
		'sha512': CryptoJS.SHA512
	};

	openBadges.Verifier = {

		/**
		 * Extracts a badge assertionUrl from PNG image
		 *
		 * @param {String} url of the hosted assertion
		 * @param {Function} callback when verification succeeds (assertionUrl)
		 * @param {Function} callback when verification does not succeed (errorString)
		 */
		getAssertionUrl: function (imageUrl, successCallback, errorCallback) {
			Firebug.Console.log("getAssertionUrl(" + imageUrl + ")");
			if (typeof imageUrl !== 'string' || imageUrl.substr(imageUrl.length - 4) !== '.png') {
				callback(errorCallback, 'Invalid image link.');
				return;
			}

			PNG.load(imageUrl,
				function (png) {
					if (!png.text.openbadges) {
						callback(errorCallback, 'Not a badge.');
					} else {
						Firebug.Console.log("getAssertionUrl: PNG.load: " + png.text.openbadges);
						callback(successCallback, png.text.openbadges);
					}
				},
				function (error) {
					callback(errorCallback, error);
				}
			);
		},

		/**
		 * Fetches and validates badge assertion from assertionUrl
		 *
		 * @param {String} url of the hosted assertion
		 * @param {Function} callback when verification succeeds (assertion)
		 * @param {Function} callback when verification does not succeed  (errorString)
		 */
		getAssertion: function (assertionUrl, successCallback, errorCallback) {
			Firebug.Console.log("getAssertion(" + assertionUrl + ")");
			$.ajax({
				dataType: 'json',
				url: assertionUrl,
				success: function (assertion) {

					Firebug.Console.log("success(" + assertion + ")");
					Firebug.Console.log("badge: " + assertion.badge);
					Firebug.Console.log("recipient: " + assertion.recipient);
					Firebug.Console.log("badge.issuer.name: " + assertion.badge.issuer.name);
					Firebug.Console.log("badge.issuer.origin: " + assertion.badge.issuer.origin);

					// check that all mandatory fields exist
					if (!assertion.badge || !assertion.recipient) {
						callback(errorCallback, 'Invalid assertion.');
						return;
					}

					var fields = ['name', 'image', 'issuer', 'criteria', 'description'];
					for (var i = 0; i < fields.length; i++) {
						if (!assertion.badge[fields[i]]) {
							callback(errorCallback, 'Invalid assertion.');
							return;
						}
						Firebug.Console.log("badge." + fields[i] + ": " + assertion.badge[fields[i]]);
					}

					if (!assertion.badge.issuer.name || !assertion.badge.issuer.origin) {
						callback(errorCallback, 'Invalid assertion.');
						return;
					}

					// recipient neither email nor hash
					var array = String(assertion.recipient).split('$');
					if (!REGEXP_EMAIL.test(assertion.recipient) && array.length !== 2) {
						callback(errorCallback, 'Invalid assertion.');
						return;
					}

					// check for supported hashing algorithms
					if (array.length === 2 && !HASH[array[0]]) {
						callback(errorCallback, array[0] + ' hash is not supported.');
						return;
					}

					callback(successCallback, assertion);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (errorThrown.name === 'SyntaxError') {
						callback(errorCallback, 'Assertion is not valid JSON string.');
					}
				}
			});
		},

		/**
		 * Verifies a badge against an email
		 *
		 * @param {String} recipient email
		 * @param {String} badge assertion JSON
		 * @param {Function} callback when verification succeeds (assertion)
		 * @param {Function} callback when verification does not succeed (errorString)
		 */
		verifyAssertion: function (email, assertion, successCallback, errorCallback) {
				Firebug.Console.log("verifyAssertion(" + email + ", " + assertion + ")");
				// some badges do not have salt
				assertion.salt = assertion.salt || '';

				Firebug.Console.log("salt: " + assertion.salt);
				Firebug.Console.log("recipient: " + assertion.recipient);

				if (email === assertion.recipient) {
					callback(successCallback, assertion);
					return;
				}

				var array = String(assertion.recipient).split('$');
				if (array.length === 2 && HASH[array[0]](email + assertion.salt).toString() === array[1]) {
					Firebug.Console.log("hashed:" + HASH[array[0]](email + assertion.salt).toString());
					callback(successCallback, assertion);
					return;
				}

				callback(errorCallback, 'Badge does not belong to ' + email + '.');
		},

		/**
		 * Performs full verification process starting from an email and badge url
		 *
		 * @param {String} recipient email
		 * @param {String} url of badge PNG image
		 * @param {Function} callback when verification succeeds (assertion)
		 * @param {Function} callback when verification does not succeed (errorString)
		 */
		verify: function (email, badgeUrl, successCallback, errorCallback) {
			openBadges.Verifier.getAssertionUrl(badgeUrl,
				function (assertionUrl) {
					openBadges.Verifier.getAssertion(assertionUrl,
						function (assertion) {
							openBadges.Verifier.verifyAssertion(email, assertion, successCallback, errorCallback);
						},
						errorCallback
					);
				},
				errorCallback
			);
		}

	};

	return openBadges;

}(OpenBadges || {}));