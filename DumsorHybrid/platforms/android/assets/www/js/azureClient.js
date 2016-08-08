angular.module('azure', [])
  .factory('client', [function () {
      var client = new WindowsAzure.MobileServiceClient('https://dumsor.azurewebsites.net');
    return client;
  }]);