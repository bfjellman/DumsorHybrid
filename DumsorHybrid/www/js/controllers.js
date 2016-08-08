angular.module('app.controllers', ['azure', 'ionic', 'ngCordova'])

  
.controller('loginCtrl', function ($scope, $state, client) {
    $scope.login = function (name) {

        alert(name);


        client.login(name).then(function succes(data) {
            console.log('logged in succesfully..')
            $state.go('dumsor');
   
        }, function (error) {
            //login failed.
        });
    }

    $scope.loginTest = function () {

        $state.go('dumsor');

    }
  

})
   
.controller('dumsorCtrl', function ($scope, $cordovaGeolocation, client) {

    var task = {};
    var lat;
    var long;
    var id = 'Get Location';
    var geoTable = client.getTable('GeoLocation');
    $scope.id = 'None';


    $scope.getLocation = function () {

        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
              

              lat = position.coords.latitude
              long = position.coords.longitude
              //alert(lat + " " + long);

              //Set up task object for pushing to Azure
              task.userID = client.currentUser.userId;
              task.latitude = lat;
              task.longitude = long;

              //push to Azure
              geoTable.insert(task)
                .then(function (insertedItem) {
                    id = insertedItem.id;
                    window.localStorage.setItem("id", String(id));
                    $scope.id = String(id);
                });
              
             
              
          }, function (err) {
              alert("Cannot get GeoLocation, please check of GPS is turned on")
          });
  
    }

    $scope.getCurrentID = function () {

        if (window.localStorage.getItem("id") !== undefined) {
            $scope.id = window.localStorage.getItem("id");
            alert("Test Local Storage");
        } else {
            $scope.id = String(id);

        }

    }
        $scope.id = String(id);
    }


)
 