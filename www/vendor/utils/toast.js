(function() {
	'use strict';
	angular
		.module('app.utils')
		.factory('toast',toast);

		function toast ($cordovaToast) {
			var toast={
				show:show,
				showBotton:showBotton
			}

			return toast;

			function show (message, duration, position) {
				return $cordovaToast.show(message, duration, position);
			};

			function showBotton (message) {
				return $cordovaToast.showShortBottom(message);
			}
		}
})();