(function() {
	'use strict';
	angular
		.module('app.core')
		.factory('dataservice',dataservice);

	function dataservice ($q,$firebaseArray,$firebaseObject,FBURL) {
		var ref= new Firebase(FBURL);

		var service={
			getPosts: getPosts,
			getPost:getPost,
			createPost:createPost,
			getComments:getComments,
			createComment:createComment,
			lastComments:lastComments,
			countGlobal:countGlobal

		};

		return service;


		function countGlobal() {
			return $firebaseObject(ref.child('countGlobal'));
		};

		function formatText (text) {
			var array= text.split('\n');
			var finalText=[];
			var auxText={};
			for (var i = 0; i < array.length; i++) {
				if(array[i].length!=0){
					auxText.text=array[i];
					if(array[i].length>2){
						 var first = array[i].trim().charAt(0);
						 var second= array[i].trim().charAt(1);
						 	if(first==='>' && second==='>'){
						 		auxText.id=array[i].replace(/[^0-9]/gi, '');
					      		auxText.other="blue";	
					      	}
					      	else if(first==='>'){
					      		auxText.other="green";
					      	}	
					};

					
					finalText.push(auxText);
					auxText={};
				}
			};

			return finalText;
		
		}

		function getPosts (id) {
			return $firebaseArray(ref.child('posts').child(id));
		};

		function getPost (id,idThread) {
			return $firebaseObject(ref.child('posts').child(id).child(idThread));
		}


		function createPost (id,post,img) {
			var deferred = $q.defer();

			countGlobal().$loaded().then(function(data) {
				var updatedData = {};
				post.time= Firebase.ServerValue.TIMESTAMP;
				post.num= data.count+1 || 1;
				if(post.text){
					post.textSplit=formatText(post.text);
				};
				var newPostRef= ref.child('posts').child(id).push();
				var newPostKey=newPostRef.key();
				updatedData['posts/'+id+ '/'+newPostKey] = post;
				updatedData['countGlobal/count'] = data.count+1 || 1;	
				deferred.resolve(ref.update(updatedData));

			},function(err) {
				deferred.reject(err)
			});

			return deferred.promise;
			
		};

		function getComments (id,idThread) {
			return $firebaseArray(ref.child('comments').child(id).child(idThread));
		}

		function createComment (id,post,comment) {
			var deferred = $q.defer();

			countGlobal().$loaded().then(function(data) {
				var updatedData = {};
				comment.time= Firebase.ServerValue.TIMESTAMP;
				comment.num= data.count+1 || 1;
				if(comment.text){
					comment.textSplit=formatText(comment.text);
				};

				
				var newCommentRef= ref.child('comments').child(post.$id).push();
				var newCommentKey = newCommentRef.key();

				updatedData['comments/'+id+'/'+post.$id+'/' + newCommentKey] = comment;
				updatedData['posts/'+id+ '/'+post.$id+'/count'] = post.count+1 || 1;
				updatedData['countGlobal/count'] = data.count+1 || 1;

				if(comment.hasOwnProperty('img')){
					updatedData['posts/'+id+ '/'+post.$id+'/countImg'] = post.countImg+1 || 1;
				};
				deferred.resolve(ref.update(updatedData));

			},function(err) {
				deferred.reject(err)
			});

			return deferred.promise;
		};


		function lastComments (id,idThread) {
			return $firebaseArray(ref.child('comments').child(id).child(idThread).orderByChild('time').limitToLast(3));
			
		};

		
	};

})();