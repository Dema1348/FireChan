(function() {
	'use strict';
	angular
		.module('app.utils')
		.factory('Upload', Upload);

		function Upload($q, $cordovaCamera,$cordovaFileTransfer,CLOUDINARY_URI,CLOUDINARY_UPLOAD_PRESET,loader) {
			
			var photo={
				select:select,
				uploadCloud:uploadCloud
			};

			return photo;

			function select () {
			 	var deferred = $q.defer();

					if (ionic.Platform.isWebView()) {

						var options =   {
						    quality: 100, 
						    destinationType: Camera.DestinationType.FILE_URI, 
						    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
						    encodingType: Camera.EncodingType.JPEG
						};

						$cordovaCamera.getPicture(options).then(
							function(result) {
								deferred.resolve(result)},
							function(err) {
								deferred.reject(err)
							});

					}
					else {
						deferred.reject('Uploading not supported in browser');
					};

					return deferred.promise;

		     };

		    function uploadCloud (imageURI) {
		    	var deferred = $q.defer();

				var fileSize;
				var percentage;

				 window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
			        fileEntry.file(function(fileObj) {
			          fileSize = fileObj.size;
			         
			          loader.show('Uploading Picture : ' + 0 + '%');
			          uploadPhoto();
			        });
			      });
		    	 

		        function uploadPhoto () {
		        	var uploadOptions = {
			          params : { 'upload_preset': CLOUDINARY_UPLOAD_PRESET}
			        };

		        	$cordovaFileTransfer.upload(CLOUDINARY_URI, imageURI, uploadOptions).then(
							function(result) {
								loader.showTime('Upload Completed',1000);
								var response = JSON.parse(decodeURIComponent(result.response));
								$cordovaCamera.cleanup();
								deferred.resolve(response);
							}, function(err) {
								$cordovaCamera.cleanup();
								deferred.reject(err);
							}, function (progress) {
				            percentage = Math.floor(progress.loaded / fileSize * 100);
				            loader.show('Uploading Picture : ' + percentage + '%');
				          });

		        	
		        }

		        return deferred.promise; 
		      
		    };

			 

		}	   
	

})();