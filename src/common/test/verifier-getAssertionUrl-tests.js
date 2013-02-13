asyncTest('Successful assertion extraction from image', function () {
	async.forEachSeries(['img/emily-mozfestivator.png', 'img/sunny-mozfesticipant.png'],
		function (item, callback) {
			OpenBadges.Verifier.getAssertionUrl(item,
				function (assertionUrl) {
					ok(true, assertionUrl);
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

asyncTest('Failed assertion extraction from image: Non PNG', function () {
	OpenBadges.Verifier.getAssertionUrl('non-png.gif',
		function (assertionUrl) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});

asyncTest('Failed assertion extraction from image: No tEXt chunk', function () {
	OpenBadges.Verifier.getAssertionUrl('img/no-text-chunk.png',
		function (assertionUrl) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});