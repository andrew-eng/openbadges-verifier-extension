/*global $, async */

var OpenBadges = (function (openBadges) {
	'use strict';

	function callback(c) {
		if (typeof c === 'function') {
			c.apply(undefined, Array.prototype.slice.call(arguments, 1));
		}
	}

	var HOST = 'http://beta.openbadges.org/displayer',
		ID = HOST + '/convert/email',
		USER = HOST + '/{userId}/groups.json',
		GROUP = HOST + '/{userId}/group/{groupId}.json';

	openBadges.Displayer = {

		/**
		 * Converts email address to user id
		 *
		 * @param {String} backpack user email
		 * @param {Function} callback when request succeeds (userId)
		 * @param {Function} callback when request does not succeed (errorString)
		 */
		convert: function (email, successCallback, errorCallback) {
			$.ajax({
				url: ID,
				type: 'post',
				dataType: 'json',
				data: {'email': email},
				success: function (res) {
					if (res.status === "okay") {
						callback(successCallback, res.userId);
					}
				},
				error: function (jqXHR) {
					switch (jqXHR.status) {
					//case 0:
					//	break;
					case 400:
					case 404:
						var res = JSON.parse(jqXHR.responseText);
						callback(errorCallback, res.error);
						break;
					}
				}
			});
		},

		/**
		 * Gets user profile from id
		 *
		 * @param {String} backpack user id
		 * @param {Function} callback when request succeeds (userJSON)
		 * @param {Function} callback when request does not succeed (errorString)
		 */
		getUser: function (userId, successCallback, errorCallback) {
			if (isNaN(parseInt(userId, 10))) {
				errorCallback('Invalid userId');
				return;
			}

			$.ajax({
				dataType: 'json',
				url: USER.replace('{userId}', userId),
				success: function (res) {
					callback(successCallback, res);
				},
				error: function (jqXHR) {
					switch (jqXHR.status) {
					case 0:
						callback(errorCallback, 'Network error.');
						break;

					case 400:
					case 404:
						var res = JSON.parse(jqXHR.responseText);
						callback(errorCallback, res.error);
						break;
					}
				}
			});
		},

		/**
		 * Gets badge group
		 *
		 * @param {String} backpack user id
		 * @param {String} backpack user badge group id
		 * @param {Function} callback when request succeeds (groupJSON)
		 * @param {Function} callback when request does not succeed (errorString)
		 */
		getGroup: function (userId, groupId, successCallback, errorCallback) {
			if (isNaN(parseInt(userId, 10)) || isNaN(parseInt(groupId, 10))) {
				errorCallback('Invalid userId or groupId');
				return;
			}

			$.ajax({
				dataType: 'json',
				url: GROUP.replace('{userId}', userId).replace('{groupId}', groupId),
				success: function (res) {
					callback(successCallback, res);
				},
				error: function (jqXHR, textStatus) {
					switch (jqXHR.status) {
					case 0:
						callback(errorCallback, 'Network error.');
						break;

					case 400:
					case 404:
						var res = JSON.parse(jqXHR.responseText);
						callback(errorCallback, res.error);
						break;
					}
				}
			});
		},

		/**
		 * Gets full profile
		 *
		 * @param {String} backpack user id
		 * @param {String} backpack user badge group id
		 * @param {Function} callback when request succeeds (fullUserProfile)
		 * @param {Function} callback when request does not succeed (errorString)
		 */
		getAll: function (email, successCallback, errorCallback) {
			OpenBadges.Displayer.convert(email,
				function (userId) {
					OpenBadges.Displayer.getUser(userId, function (user) {
						async.forEachSeries(user.groups,
							function (item, callback) {
								OpenBadges.Displayer.getGroup(userId, item.groupId, function (group) {
									for (var i = 0; i < user.groups.length; i++) {
										if (user.groups[i].groupId !== group.groupId) {
											continue;
										}
										user.groups[i].badges = group.badges;
									}
									callback();
								});
							},
							function (err, results) {
								callback(successCallback, user);
							}
						);
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