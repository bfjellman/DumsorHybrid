angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

    .state('login', {
        url: '/page1',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('menu', {
        url: '/menu',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })

      


  .state('dumsor', {
    url: '/page3',
    templateUrl: 'templates/dumsor.html',
    controller: 'dumsorCtrl'
  })
  .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'mapCtrl'
  })

$urlRouterProvider.otherwise('/page1')

  

});