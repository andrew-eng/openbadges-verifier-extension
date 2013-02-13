asyncTest('Successful email conversion', function () {
	async.forEachSeries(['brian@mozillafoundation.org', 'sunny@mozillafoundation.org'],
		function (item, callback) {
			OpenBadges.Displayer.convert(item,
				function (userId) {
					ok(true, item + ' -> ' + userId);
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

asyncTest('Failed email conversion: Empty email', function () {
	OpenBadges.Displayer.convert('',
		function (userId) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(error, error);
			start();
		}
	);
});

asyncTest('Failed email conversion: Rubbish email', function () {
	async.forEachSeries([[], {}, null, undefined, 12345],
		function (item, callback) {
			OpenBadges.Displayer.convert(item,
				function (userId) {
					ok(false, 'Should not have succeeded.');
					callback();
				},
				function (error) {
					ok(error, error);
					callback();
				}
			);
		},
		function (err, results) {
			start();
		}
	);
});

asyncTest('Failed email conversion: Non-valid email', function () {
	OpenBadges.Displayer.convert('non-valid-email',
		function (userId) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(error, error);
			start();
		}
	);
});

asyncTest('Failed email conversion: Non-existant email', function () {
	OpenBadges.Displayer.convert('nonexistant@example.com',
		function (userId) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(error, error);
			start();
		}
	);
});