angular.module('azure', ['ionic'])
  .factory('client', [function () {

    var client = new WindowsAzure.MobileServiceClient('https://dumsor.azurewebsites.net');
    return client;
   
  }]);