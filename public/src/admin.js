'use strict';
/* globals $, app */

define('admin/plugins/onedrive', ['settings'], function(Settings) {
	var ACP = {};
	ACP.init = function() {
		Settings.load('onedrive', $('.onedrive-settings'));
		$('#save').on('click', function() {
			Settings.save('onedrive', $('.onedrive-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'onedrive-config-saved',
					title: 'Settings Saved',
					message: 'onedrive config saved'
				});
			});
		});
	};
	return ACP;
});