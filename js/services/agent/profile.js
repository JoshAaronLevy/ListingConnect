var _ = require('lodash');
var config = require('../../../config');

var agentProfile = module.exports = ['$http', '$rootScope', 'apiService', function($http, $rootScope, apiService) {

  return {
    getPointer: apiService.getPointer,

    get: function(callback) {
      var postCmd = 'where=' + escape(JSON.stringify({parent: apiService.getPointer($rootScope.user.objectId)}));
      return apiService
      .agent.get(postCmd)
      .success(data => {
        console.warn(data);
        data = data.payload ? data.payload : data;
        data = data.results && data.results.length > 0 ? data.results[0] : data;
        if (!data || !data.objectId){
          console.error('Invalid server response for Agent', arguments);
        } else {
          $rootScope.agent = data;
          localStorage.setItem('agent', JSON.stringify(data));
        }
      });
    }
  };
}];
