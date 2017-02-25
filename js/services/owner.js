var _ = require('lodash');
var config = require('../../config');

var ownerService = module.exports = ['$http', '$rootScope', 'apiService', function($http, $rootScope, apiService) {

  $rootScope.property = {};

  return {
    getPointer: apiService.getPointer,

    get: function(callback) {
      var postCmd = 'where=' + escape(JSON.stringify({user: apiService.getPointer($rootScope.user.objectId)}));
      if($rootScope.owner){
        return Promise.resolve($rootScope.owner);
      }
      return apiService
      .owners.get(postCmd)
      .success(data => {
        $rootScope.owner = data.results[0];
      })
      .error(console.error.bind(console));
    }
  };
}];
