asyncTest('Successful verification', function () {
	async.forEachSeries([
			['emily@mozillafoundation.org', 'img/emily-mozfestivator.png'],
			['sunny@mozillafoundation.org', 'img/sunny-mozfesticipant.png']
		],
		function (item, callback) {
			OpenBadges.Verifier.verify(item[0], item[1],
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

asyncTest('Failed verification: Wrong email', function () {
	async.forEachSeries([
			['sunny@mozillafoundation.org', 'img/emily-mozfestivator.png'],
			['brian@mozillafoundation.org', 'img/sunny-mozfesticipant.png'],
			['emily@mozillafoundation.org', 'img/sunny-mozfesticipant.png']
		],
		function (item, callback) {
			OpenBadges.Verifier.verify(item[0], item[1],
				function () {
					ok(false, 'Should not have succeeded.');
					callback();
				},
				function (error) {
					ok(true, typeof error === 'string' ? error : JSON.stringify(error));
					callback();
				}
			);
		},
		function (err, results) {
			start();
		}
	);
});

asyncTest('Failed verification: Rubbish input', function () {
	async.forEachSeries([[{}, ''], [[], 12345], ['emily@mozillafoundation.org', undefined], [null, 'img/emily-mozfestivator.png']],
		function (item, callback) {
			OpenBadges.Verifier.verify(item[0], item[1],
				function () {
					ok(false, 'Should not have succeeded.');
					callback();
				},
				function (error) {
					ok(true, typeof error === 'string' ? error : JSON.stringify(error));
					callback();
				}
			);
		},
		function (err, results) {
			start();
		}
	);
});