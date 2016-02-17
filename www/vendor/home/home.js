(function() {
	'use strict';
	angular.module('app.home')
		.controller('HomeCtrl',HomeCtrl);

	function HomeCtrl ($scope,dataservice) {
		var vm = this;
		vm.total=dataservice.countGlobal();
	}
})();