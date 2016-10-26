// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'azure'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
        
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    $stateProvider

      .state('app.login', {
          url: '/',
          views: {
              'menuContent': {
                  templateUrl: 'templates/login.html',
                  controller: 'loginCtrl'
              }
          }
      })

    .state('app.menu', {
        url: '/',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
            }
        }
    })

    .state('app.dumsor', {

        url: '/dumsor',
        views: {
            'menuContent': {
                templateUrl: 'templates/dumsor.html',
                controller: 'dumsorCtrl'
            }
        }      
    })
    .state('app.map', {

        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'templates/map.html',
                controller: 'mapCtrl'
            }
        }
    })

 
});