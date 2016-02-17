(function() {
	'use strict';
	angular
		.module('app.utils')
		.factory('loader',loader);

		function loader ($ionicLoading) {

			var loading ={
				show:show,
				hide:hide,
				showTime:showTime
			};

			return loading;

			function show (msg) {
				$ionicLoading.show({
					template: msg || 'Loading...'
				})
			};

			function hide () {
				$ionicLoading.hide();
			};


			function showTime (msg,time) {
				$ionicLoading.show({
					template: msg || 'Loading...',
					duration: time || 3000
				});
			};
		};
})();