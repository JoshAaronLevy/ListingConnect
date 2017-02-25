var config = require('../../../config');

const TIMEOUT = config.localTimeout || 5000;

var matchService = module.exports = ['$http', '$rootScope', '$timeout', 'apiService', function($http, $rootScope, $timeout, apiService) {

  var _cached = null,
    _faves = null;

  return {
    getPointer: apiService.getPointer,

    get: function _get(cb) {
      if ( _cached ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
        return Promise.resolve(_cached);
      }
      var state = $rootScope.consumer.state;
      // var cities = [];
      //   if (buyer && buyerCities) {
      //     cities = cities.concat(buyerCities);
      //   }
      //   if (seller && sellerCity) {
      //     cities = cities.concat([sellerCity]);
      //   }
      // // Note: assert(cities.length === 3);
      // // find matching consumers with any of the cities of the current agent
      var postCmd = 'include=parent&where=' + encodeURIComponent(JSON.stringify({
         "state": state,
         // "cities": {"$in": cities}
       }));
      return apiService
      .agent.get(postCmd)
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
      .match[item.objectId ? 'update' : 'create'](item)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
        _cached = null;
      })
      .error(console.error.bind(console));
    }.bind(this),
    remove: function _remove(item) {
      return apiService
      .match.remove(item)
      .success(data => {
        $rootScope.status = 'Deleted match';
        _cached = null;
        _faves = null;
      }).error(console.error.bind(console));
    }.bind(this)
  };

}];
