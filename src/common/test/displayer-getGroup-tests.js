asyncTest('Failed request: Rubbish group', function () {
	async.forEachSeries([[[], []], [{}, {}], [null, null], [undefined, undefined]],
		function (item, callback) {
			OpenBadges.Displayer.getGroup(item[0], item[1],
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

asyncTest('Failed request: Non-valid group', function () {
	OpenBadges.Displayer.getGroup(12345, 'non-valid-group',
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

asyncTest('Failed request: Non-existant group', function () {
	OpenBadges.Displayer.getGroup(21, 93070327047320874327388679324230,
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