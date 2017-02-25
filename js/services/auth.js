var AGENT_ROLE = ['u7i8jhljbo'];
var CONSUMER_ROLE = ['uNh39OkVYS'];

var _ = require('lodash');
var config = require('../../config');

var authService = module.exports = ['$rootScope', 'Cache', function($rootScope, Cache) {
  var currentAgent = Cache.cache.bind(null, 'agent');
  var currentConsumer = Cache.cache.bind(null, 'consumer');
  var currentUser = Cache.cache.bind(null, 'user');

  function errHandler(err) {
    console.error('Err.Handler:', err, $rootScope);
    $rootScope.status = null;
    $rootScope.error = err && err.message || err;
  }

  var svc = {
    login: function(username, password) {
      currentUser(null);
      currentAgent(null);
      currentConsumer(null);
      var postData = {username: username || $scope.username, password: password || $scope.password};
      return apiService
      .auth.send(postData)
      .success(function(data) {
        console.warn('auth.success', data);
        data = data.payload ? data.payload : data;
        if (!data || !data.objectId) {
          $rootScope.error = 'Invalid login and password';
          console.error('Invalid server response', arguments);
        } else {
          currentUser(data);
          $rootScope.success = 'Retrieving account information. Please wait...';
        }
        return data;
      })
      .error(errHandler)
      .then(svc.getRoles);
    },
    isAgent: (user = $rootScope.user) => {
      return $rootScope.agent || (user && AGENT_ROLE.indexOf(user.role.objectId) > -1) || $rootScope.user && AGENT_ROLE.indexOf($rootScope.user.role.objectId) > -1;
    },
    isConsumer: (user = $rootScope.user) => {
      return $rootScope.consumer || (user && CONSUMER_ROLE.indexOf(user.role.objectId) > -1) || $rootScope.user && CONSUMER_ROLE.indexOf($rootScope.user.role.objectId) > -1;
    },
    getRoles: function findRole() {
      var user = currentUser();
      var postCmd = 'where=' + escape(JSON.stringify({parent: apiService.getPointer(user.objectId)}));
      console.error('authService.findRole', postCmd);
      // if (authService.isAgent(user)){
      return apiService
      .agent.get(postCmd)
      // .error(errHandler)
      .success(data => {
        console.warn('agent.get', data);
        data = data.payload ? data.payload : data;
        data = data.results && data.results.length > 0 ? data.results[0] : data;
        if (!data || !data.objectId){
          $rootScope.error = 'Invalid Agent';
          // console.error('Invalid server response for Agent', arguments);
          $rootScope.agent = null;
          localStorage.removeItem('agent');
        } else {
          // Only sucess sets
          $rootScope.agent = data;
          localStorage.setItem('agent', JSON.stringify(data));
          $rootScope.status = 'Successfully retrieved info!';
          window.location = '/agent/profile.html';
        }
      })
      .then(function consumerStep(prevStepResult) {
        return apiService
        .consumer.get(postCmd)
        // .error(errHandler)
        .success(data => {
          console.warn('consumer.get', data);
          data = data.payload ? data.payload : data;
          data = data.results && data.results.length > 0 ? data.results[0] : data;
          if (!data || !data.objectId){
            $rootScope.error = 'Invalid Consumer';
            // console.error('Invalid server response for Consumer', arguments);
            $rootScope.consumer = null;
            localStorage.removeItem('consumer');
          } else {
            $rootScope.consumer = data;
            localStorage.setItem('consumer', JSON.stringify(data));
            $rootScope.status = 'Successfully retrieved info!';
            window.location = '/consumer/profile.html';
          }
        });
      });
    }
  };
  return svc;
}];