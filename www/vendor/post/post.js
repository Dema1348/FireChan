(function() {
	'use strict';
	angular
		.module('app.post')
		.controller('PostCtrl',PostCtrl);

		function PostCtrl (dataservice,$stateParams,loader,fullName,$scope,$ionicModal,Upload) {
			var vm = this;

			vm.id = $stateParams.id;
			vm.idThread = $stateParams.idThread;
			vm.title= fullName.getName(vm.id);
			vm.comment={}

			loader.show();
			dataservice.getPost(vm.id,vm.idThread).$loaded().then(donePost).catch(error);	

			function donePost (data) {
				vm.post=data;				
				dataservice.getComments(vm.id,vm.idThread).$loaded().then(doneComments).catch(error);
			};

			function doneComments (data) {
				vm.comments=data;				
				loader.hide();
			};

			function error (error) {
				loader.showTime(error);
			};

			$ionicModal.fromTemplateUrl('vendor/modals/modal-new-comment.html', {
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

		 	vm.newComment=function  () {
		 		if(vm.img){
		 			Upload.uploadCloud(vm.img).then(
						function(result) {
							loader.show('Upload data');
							vm.comment.img=result.public_id;
							vm.comment.imgBytes=result.bytes;
							vm.comment.imgFormat=result.format;

							dataservice.createComment(vm.id ,vm.post,vm.comment).then(doneNewComment).catch(error);
					},
						function(err) {
					 	loader.showTime(err);
					});
		 		}else{
		 			dataservice.createComment(vm.id ,vm.post,vm.comment).then(doneNewComment).catch(error);
		 		}
				
				
			};

			function doneNewComment (data) {
				loader.hide();
				vm.img=false;
				vm.comment={};
				vm.closeModal();
			};
		  

		 	vm.uploadFile = function() {

				Upload.select().then(
					function(res) {
						vm.img=res;
					}, function(err) {
							loader.showTime(err);
					})
				;

			};

			
		};
})();