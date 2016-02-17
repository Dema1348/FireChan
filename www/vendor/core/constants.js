(function() {
	'use strict';
	angular.module('app.core')		
		.constant('FBURL','<YOUR-FIREBASE-APP>')
		.constant('CLOUDINARY_URI',"<YOUR-API-UPLOAD>")
		.constant('CLOUDINARY_UPLOAD_PRESET',"<YOUR-UPLOAD-PRESET>");

})();