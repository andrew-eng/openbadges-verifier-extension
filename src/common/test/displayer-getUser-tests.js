asyncTest('Successful profile request', function () {
	async.forEachSeries([21, 2761],
		function (item, callback) {
			OpenBadges.Displayer.getUser(item,
				function (user) {
					ok(true, item + ' -> ' + JSON.stringify(user));
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

asyncTest('Failed profile request: Empty ID', function () {
	OpenBadges.Displayer.getUser('',
		function (user) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});

asyncTest('Failed profile request: Rubbish ID', function () {
	async.forEachSeries([[], {}, null, undefined],
		function (item, callback) {
			OpenBadges.Displayer.getUser(item,
				function (user) {
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

asyncTest('Failed profile request: Non-valid ID', function () {
	OpenBadges.Displayer.getUser('non-valid-id',
		function (user) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});

asyncTest('Failed profile request: Non-existant ID', function () {
	OpenBadges.Displayer.getUser('972340720384702387402398403928490328',
		function (user) {
			ok(false, 'Should not have succeeded.');
			start();
		},
		function (error) {
			ok(true, error);
			start();
		}
	);
});