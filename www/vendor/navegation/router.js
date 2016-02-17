(function() {
	'use strict';

	angular.module('app.navegation')

	.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider

	    .state('app', {
	    url: '/app',
	    abstract: true,
	    templateUrl: 'vendor/navegation/menu.html'
	  })

	  .state('app.home', {
	    url: '/home',
	    views: {
	      'menuContent': {
	        templateUrl: 'vendor/home/home.html',
	        controller: 'HomeCtrl',
	        controllerAs:'vm'
	      }
	    }
	  })

	  .state('app.posts', {
	    url: '/:id',
	    views: {
	      'menuContent': {
	        templateUrl: 'vendor/posts/posts.html',
	        controller: 'PostsCtrl',
	        controllerAs: 'vm'
	      }
	    }
	  })

	  .state('app.thread', {
	    url: '/:id/thread/:idThread',
	    views: {
	      'menuContent': {
	        templateUrl: 'vendor/post/post.html',
	        controller: 'PostCtrl',
	        controllerAs: 'vm'
	      }
	    }
	  })



	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/home');
	});

})();