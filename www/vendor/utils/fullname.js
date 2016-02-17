(function() {
	'use strict';
	angular
		.module('app.utils')
		.factory('fullName',fullName);

		function fullName () {
			var name={
				getName:getName
			}

			return name;

			function getName (id) {

				var name="";
				switch(id){
					case 'b':
					name="/b/ - Random";
					break;

					case 'g':
					name="/g/ - Technology";
					break;

					case 'x':
					name="/x/ - Paranormal";
					break;

					default:
					name="No name";
					break;

				};
				return name;
			};
		};
})();