asyncTest('Successful assertion request', function () {
	async.forEachSeries([
			'json/sunny-mozfesticipant.json',
			'json/emily-mozfestivator.json',
			'json/md5-emily-mozfestivator.json',
			'json/sha256-emily-mozfestivator.json',
			'json/sha512-emily-mozfestivator.json'
		],
		function (item, callback) {
			OpenBadges.Verifier.getAssertion(item,
				function (assertion) {
					ok(true, JSON.stringify(assertion));
					callback();
				},
				function (error) {
					ok(false, 'Should not have failed.');
					callback();
				}
			);
		},
		function (err, results) {
			start();
		}
	);
});

asyncTest('Failed assertion request: Assertion not JSON', function () {
	async.forEachSeries(['index.html', 'qunit-1.11.0.js', 'qunit-1.11.0.css', 'img/sunny-mozfesticipant.png'],
		function (item, callback) {
			OpenBadges.Verifier.getAssertion(item,
				function (assertion) {
					ok(false, 'Should not have succeeded.');
					callback();
				},
				function (error) {
					ok(true, error);
					callback();
				}
			);
		},
		function (err, results) {
			start();
		}
	);
});

asyncTest('Failed assertion request: JSON not assertion', function () {
	OpenBadges.Verifier.getAssertion('json/not-assertion.json',
		function (assertion) {
			console.log(assertion);
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});

asyncTest('Failed assertion request: Unsupported hash algorithm', function () {
	OpenBadges.Verifier.getAssertion('json/unsupported-hash.json',
		function (assertion) {
			console.log(assertion);
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});