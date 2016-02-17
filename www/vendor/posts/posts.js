(function() {
	'use strict';
	angular.module('app.posts')
		.controller('PostsCtrl',PostsCtrl);

		function PostsCtrl (dataservice,$stateParams,loader,$scope,fullName,$state,$ionicModal,Upload,$ionicPosition,$ionicScrollDelegate) {

			var vm = this;

			vm.id = $stateParams.id;
			vm.title= fullName.getName(vm.id);
			vm.post={}
			loader.show();
			dataservice.getPosts(vm.id).$loaded().then(donePost).catch(error);

			function donePost (data) {
				vm.posts=data;
				vm.posts.$watch(function(event) {
					loaded3comments(vm.posts.$getRecord(event.key));
				})
				angular.forEach(vm.posts,loaded3comments);
				loader.hide();
			
			};

			function error (error) {
				loader.showTime(error);
			};

			function loaded3comments (post) {
				dataservice.lastComments(vm.id,post.$id).$loaded().then(function(data) {
					post.comments=data;
				}).catch(error);
			};


			$ionicModal.fromTemplateUrl('vendor/modals/modal-new-post.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
			}).then(function(modal) {
			    vm.modal = modal;
			});

			vm.new=function  () {
				vm.modal.show();			 
			};

			 vm.closeModal = function() {
		   		vm.modal.hide();
		 	};

		 	$scope.$on('$destroy', function() {
		    	vm.modal.remove();
		   });

			vm.newPost=function  () {
				Upload.uploadCloud(vm.img).then(
					function(result) {
						loader.show('Upload data');
						vm.post.img=result.public_id;
						vm.post.imgBytes=result.bytes;
						vm.post.imgFormat=result.format;
						// vm.post.imgWidth=result.width;
						// vm.post.imgHeight=result.height;

						dataservice.createPost(vm.id,vm.post).then(doneNewPost).catch(error);
					},
					function(err) {
				 	loader.showTime(err);
				});
				
			};

			function doneNewPost (data) {
				loader.hide();
				vm.img=false;
				vm.imgName=false;
				vm.post={};
				vm.closeModal();
			};
		  

		 	vm.uploadFile = function() {

				Upload.select().then(
					function(res) {
						vm.img=res;
						vm.imgName="file selected";
					}, function(err) {
							loaded.showTime(err);
					})
				;

			};
	

			


			

		};
})();