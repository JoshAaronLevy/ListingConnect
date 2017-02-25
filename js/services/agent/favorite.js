var config = require('../../../config');

const TIMEOUT = config.localTimeout || 5000;

var favoriteService = module.exports = ['$http', '$rootScope', '$timeout', 'apiService', function($http, $rootScope, $timeout, apiService) {

  var _cached = null,
    _faves = null;

  return {
    getPointer: apiService.getPointer,

    get: function _get(cb) {
      if ( _cached ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
        return Promise.resolve(_cached);
      }
      var postCmd = 'include=consumer&where=' + escape(JSON.stringify({agent: apiService.getPointer($rootScope.agent.objectId, 'Agent')}));
      return apiService
      .favorite.get(postCmd)
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
      .favorite[item.objectId ? 'update' : 'create'](item)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
        _cached = null;
      })
      .error(console.error.bind(console));
    }.bind(this),
    remove: function _remove(item) {
      return apiService
      .favorite.update(item)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Deleted favorite';
        _cached = null;
        _faves = null;
      }).error(console.error.bind(console));
    }.bind(this)
  };

}];
