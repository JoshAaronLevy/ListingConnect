var config = require('../../../config');

const TIMEOUT = config.localTimeout || 5000;

var favoriteService = module.exports = ['$http', '$rootScope', '$timeout', 'apiService', function($http, $rootScope, $timeout, apiService) {

  var _cached = null,
    _faves = null;

  return {
    getPointer: apiService.getPointer,

    get: function _get(cb) {
      if ( _faves ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _faves); }
        return Promise.resolve(_faves);
      }
      var postCmd = 'include=agent&where=' + escape(JSON.stringify({savedBy: 'Consumer', consumer: apiService.getPointer($rootScope.consumer.objectId, 'Consumer')}));
      return apiService
      .favorite.get(postCmd)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        _faves = data.results;
        if ( typeof(cb) === 'function' ) { return cb(null, _faves); }
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
      .favorite.remove(item)
      .success(data => {
        $rootScope.status = 'Deleted favorite';
        _cached = null;
        _faves = null;
      }).error(console.error.bind(console));
    }.bind(this)
  };

}];
