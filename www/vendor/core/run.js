(function() {
	'use strict';
	angular.module('app.core')

		.run(function($ionicPlatform,$rootScope,toast,contextualDateService,$ionicModal,loader,dataservice,Upload,$ionicPosition,$ionicScrollDelegate,$timeout) {
		  $ionicPlatform.ready(function() {
		    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs)
		    if (window.cordova && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		      cordova.plugins.Keyboard.disableScroll(true);

		    };
		    if (window.StatusBar) {
		      // org.apache.cordova.statusbar required
		      StatusBar.styleDefault();
		    };

		  });

		  $rootScope.reply={};
		  $rootScope.post={};
		  $rootScope.threadActivo=-1;
		  $rootScope.expand = function(post) {
				post.big=!post.big;
			};

		 $rootScope.onHold=function(time) {
				toast.showBotton(contextualDateService.formatRelative(time));
			
			};

		$ionicModal.fromTemplateUrl('vendor/modals/modal-new-comment-direct.html', {
		    scope: $rootScope,
		    animation: 'slide-in-up'
			}).then(function(modal) {
			    $rootScope.modalReply = modal;
			});

		$rootScope.newReplyDirect=function  (number,post,id) {
			$rootScope.id=id;
			$rootScope.post=post;
			$rootScope.number=number;
			$rootScope.reply.text='>>'+number+'\n';
			$rootScope.modalReply.show();			 
		};

		$rootScope.closeModalReply = function() {
	   		$rootScope.modalReply.hide();
	 	};

	 	$rootScope.$on('$destroy', function() {
	    	$rootScope.modalReply.remove();
	  	});

	  	$rootScope.newReply=function  () {	
		 		if($rootScope.img){
		 			Upload.uploadCloud($rootScope.img).then(
						function(result) {
							loader.show('Upload data');
							$rootScope.reply.img=result.public_id;
							$rootScope.reply.imgBytes=result.bytes;
							$rootScope.reply.imgFormat=result.format;
							dataservice.createComment($rootScope.id, $rootScope.post,$rootScope.reply).then(doneNewComment).catch(error);
					},
						function(err) {
					 	loader.showTime(err);
					});
		 		}else{
		 			
		 			dataservice.createComment($rootScope.id,$rootScope.post,$rootScope.reply).then(doneNewComment).catch(error);
		 		}

		 	
				
				
			};

		function doneNewComment (data) {
			loader.hide();
			$rootScope.img=false;
			$rootScope.reply={};
			$rootScope.closeModalReply();
		};

		function error (error) {
			loader.showTime(error);
		};


	  	$rootScope.uploadFile = function() {

				Upload.select().then(
					function(res) {
						$rootScope.img=res;
					}, function(err) {
							loader.showTime(err);
					})
				;

		};

		$rootScope.goTo =function(id) {
				try{
					var position= $ionicPosition.position(angular.element(document.getElementById('thread-'+id)));
					$ionicScrollDelegate.$getByHandle('focusText').scrollTo(position.left, position.top, true);
					$rootScope.threadActivo=id;
					$timeout(function() {
						$rootScope.threadActivo=-1;
					}, 3000);
				}catch(ex){
					toast.showBotton('Thread not found');
				}
				
		};


		});

		
})();