var _ = require('lodash');
var config = require('../../../config');

var consumerProfile = module.exports = ['$http', '$rootScope', 'apiService', 'authService', function($http, $rootScope, apiService, authService) {

  return {
    getPointer: apiService.getPointer,

    get: function(callback) {
      var postCmd = 'where=' + escape(JSON.stringify({parent: apiService.getPointer($rootScope.user.objectId)}));
      return apiService
      .consumer.get(postCmd)
      .success(data => {
        console.warn(data);
        data = data.payload ? data.payload : data;
        data = data.results && data.results.length > 0 ? data.results[0] : data;
        if (!data || !data.objectId){
          console.error('Invalid server response for Consumer', arguments);
        } else {
          $rootScope.consumer = data;
          localStorage.setItem('consumer', JSON.stringify(data));
        }
      });
    }

    // get: function(user, callback) {
    //   return authService.getRoles(user);
    // }
  };
}];
