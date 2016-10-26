

  

angular.module('app.controllers', ['azure', 'ionic', 'ngCordova'])

.factory('cordovaReady', function ($rootScope, $q, $timeout) {
    var loadingDeferred = $q.defer();

    document.addEventListener('deviceready', function () {
        $timeout(function () {
            $rootScope.$apply(loadingDeferred.resolve);
        });
    });

    return function cordovaReady() {
        return loadingDeferred.promise;
    };
})




  
.controller('loginCtrl', function ($scope, $state, client, cordovaReady) {

    cordovaReady().then(function () {

        $scope.login = function (name) {

            client.login(name).then(function succes(data) {

                console.log('logged in succesfully..')
                $state.go('menu');

   
            }, function (error) {
                //login failed.
            });
        }

        $scope.skipLogin = function () {

            $state.go('menu');
        }
    })
})

.controller('menuCtrl', function ($scope, $state, client, cordovaReady) {

    cordovaReady().then(function () {

        $scope.reportPower = function () {

            $state.go('dumsor');

        }
        $scope.mapTest = function () {
            $state.go('map');
        }
    })

})

  
.controller('dumsorCtrl', function ($scope, $cordovaGeolocation, client, cordovaReady) {

    var geoTable = client.getTable('GeoLocation');
    cordovaReady().then(function () {
        registerForPushNotifications();
    })
    

    //initialize task
    var task = {};
    var power;
    var lat;
    var long;
    var id = 'Get Location';
    $scope.id = 'None';
    refreshDisplay();

    function refreshDisplay() {

        power = true;
        $scope.Power = "Power: ON";
        $scope.onStyle = "button-stable button-outline";
        $scope.offStyle = "button-dark";
        $scope.currentImage = "lighton.png";

    }

    $scope.getLocation = function (button) {

        if (power) {

            //reset task
            var task = {};

            power = false;

            $scope.Power = "Power: OFF";
            $scope.offStyle = "button-stable button-outline";
            $scope.onStyle = "button-dark";
            $scope.currentImage = "lightoff.png";

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
                  task.power = "off";

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
        }//end if

        button.setAttribute('disabled', true);

        setTimeout(function () {
            button.value = oldValue;
            button.removeAttribute('disabled');
        }, 3000)
  
    }

    $scope.powerOn = function (button) {
     

        if (!power) {

            task.power = "on";
            task.id = id;
            geoTable.update(task);
            refreshDisplay();

        }//end if

        button.setAttribute('disabled', true);

        setTimeout(function () {
            button.value = oldValue;
            button.removeAttribute('disabled');
        }, 3000)
  
    }

    $scope.mapTest = function () {

        var task = {};
        var lat, long;
        var min, max;
        
        //Set up task object for pushing to Azure
        task.userID = client.currentUser.userId;
        

        //generate random point in Accra following angled south beach in a sort of square

        for (var i = 0; i < 20; i++) {

            max = 0.369453;
            min = 0.045320;

            long = Math.random() * (max - min) + min;
            console.log("Longitude: " + long);

            max = 5.746632;
            min = ((long * -1) + 14.819) / 2.6337;
            console.log("Min = " + min);

            lat = Math.random() * (max - min) + min;
            console.log("Latitude: " + lat);

            long = long * -1;

            task.latitude = lat;
            task.longitude = long;
            task.power = "off";

            //push to Azure
            geoTable.insert(task)
              .then(function (insertedItem) {
                  id = insertedItem.id;
                  window.localStorage.setItem("id", String(id));
                  $scope.id = String(id);
              });




            
        }
        
    }

      
})

.controller('mapCtrl', function ($scope, $cordovaGeolocation, client, cordovaReady) {

    var lat = 5.6037;
    var long = 0.1870;

    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {

          lat = position.coords.latitude
          long = position.coords.longitude          

      }, function (err) {
          alert("Cannot get GeoLocation, please check of GPS is turned on")
      });

    loadMapScenario();

    function loadMapScenario() {

        var recordList = [];
        var map;


        //document.getElementById('startDate').addEventListener('change', updateMap);
        //document.getElementById('endDate').addEventListener('change', updateMap);



        var locations = [];
        var client = new WindowsAzure.MobileServiceClient('https://dumsor.azurewebsites.net');
        geoTable = client.getTable("GeoLocation");
        var skip = 0;

        getData();

        function getData() {
            geoTable.skip(skip).take(50).read()
            .then(success, failure);
        }

        function success(results) {
            console.log("MADE IT TO SUCCESS");
            var numItemsRead = results.length;

            //var testDate = new Date("1990-1-1");
            //console.log(testDate);

            for (var i = 0; i < results.length; i++) {

                var row = results[i];
                recordList.push(row);
                //console.log(testDate > row.createdat);
                locations.push(new Microsoft.Maps.Location(row.latitude, row.longitude));

            }



            if (numItemsRead < 1) {
                showMap();
            } else {
                skip += 50;

                getData(skip);
            }


        }//end success


        function failure(error) {
            throw new Error('Error loading data: ', error);

        }

        function showMap() {
          
            console.log("MADE IT TO MAP");
            console.log("Locations Length: " + locations.length);
            console.log("Records length" + recordList.length);


            map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
                credentials: 'AvmVgMv96AKRtgYRdBfbD2vUDxXYVLv0iREGDXUUKMylW7qnGkhUBpKIzRKa5mZC',
                mapTypeId: Microsoft.Maps.MapTypeId.canvasDark,
                //center: new Microsoft.Maps.Location(39.393486, -98.100769),
                center: new Microsoft.Maps.Location(lat, long),
                zoom: 10
            });

            Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', function () {
                // Creating sample Pushpin data within map view

                var heatMap = new Microsoft.Maps.HeatMapLayer(locations);
                map.layers.insert(heatMap);

            });
        }


    }
})



 