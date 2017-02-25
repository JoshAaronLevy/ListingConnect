var config = require('../../../config');

const TIMEOUT = config.localTimeout || 5000;

var leadService = module.exports = ['$http', '$rootScope', '$timeout', 'apiService', function($http, $rootScope, $timeout, apiService) {

  var _cached = null,
    _faves = null;

  return {
    getPointer: apiService.getPointer,

    get: function _get(cb) {
      if ( _cached ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
        return Promise.resolve(_cached);
      }
      var state = $rootScope.agent.state;
      // var cities = [];
      //   if (agent && agent.cities) {
      //     cities = cities.concat(agent.cities);
      //   };
      // // Note: assert(cities.length === 3);
      // // find matching consumers with any of the cities of the current agent
      var postCmd = 'include=parent&where=' + encodeURIComponent(JSON.stringify({
         "state": state,
         // "cities": {"$in": cities}
       }));
      return apiService
      .consumer.get(postCmd)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        _faves = data.results;
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
      }).error(console.error.bind(console));
    }.bind(this),
    save: function _save(item) {
      var self = this;
      return apiService
      .consumer[item.objectId ? 'update' : 'create'](item)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
        _cached = null;
      })
      .error(console.error.bind(console));
    }.bind(this),
    getMessages: function _get(cb) {
      if ( _cached ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
        return Promise.resolve(_cached);
      }
      var postCmd = 'include=consumer&where=' + escape(JSON.stringify({agent: apiService.getPointer($rootScope.agent.objectId, 'Agent')}));
      return apiService
      .message.get(postCmd)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        _faves = data.results;
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
      }).error(console.error.bind(console));
    }.bind(this),
    saveMessages: function _save(item) {
      var self = this;
      return apiService
      .message.create(item)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
        _cached = null;
      })
      .error(console.error.bind(console));
    }.bind(this),
    remove: function _remove(item) {
      return apiService
      .consumer.remove(item)
      .success(data => {
        $rootScope.status = 'Deleted consumer';
        _cached = null;
        _faves = null;
      }).error(console.error.bind(console));
    }.bind(this)
  };

}];
