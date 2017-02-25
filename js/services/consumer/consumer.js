var _ = require('lodash');
var config = require('../../../config');

var consumerService = module.exports = ['$http', '$rootScope', 'apiService', 'Cache', function($http, $rootScope, apiService, Cache) {

  var _cached = null,
    _faves = null;
  var current = Cache.cache.bind(null, 'consumer');

  return {
    current: current,

    getPointer: apiService.getPointer,

    getProfile: function(callback) {
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
    }.bind(this),
    getConsumerProfile: function(callback) {
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
          $('.modal.in').modal('toggle');
        }
      });
    }.bind(this),
    saveProfile: function _save() {
      var item = $rootScope.consumer;
      // var self = this;
      return apiService
      .consumer.update(item)
      .success(data => {
        if ($rootScope.consumer.objectId) {
          data = data.data || data;
          $rootScope.status = 'Saved Successfully!';
          _cached = null;
          // $('.modal.in').modal('toggle');
          // location.reload();
        } else {
          $scope.error('Unable to save Consumer data');
        }
      })
      .error(console.error.bind(console));
    }.bind(this),
    getAgents: function _get(cb) {
      if ( _cached ) {
        if ( typeof(cb) === 'function' ) { return cb(null, _cached); }
        return Promise.resolve(_cached);
      }
      var state = $rootScope.consumer.state;
      // var cities = [];
      //   if (consumer && consumer.cities) {
      //     cities = cities.concat(consumer.cities);
      //   };
      // // Note: assert(cities.length === 3);
      // // find matching agents with any of the cities of the current agent
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
    getMessages: function _get(cb) {
      var postCmd = 'include=agent&where=' + escape(JSON.stringify({consumer: apiService.getPointer($rootScope.consumer.objectId, 'Consumer')}));
      return apiService
      .message.get(postCmd)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        _faves = data.results;
        if ( typeof(cb) === 'function' ) { return cb(null, _faves); }
      }).error(console.error.bind(console));
    }.bind(this),
    createMessage: function _save(message) {
      var self = this;
      return apiService
      .message.create(message)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
      })
      .error(console.error.bind(console));
    }.bind(this),
    updateMessage: function _save(message) {
      var self = this;
      return apiService
      .message.update(message)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
      })
      .error(console.error.bind(console));
    }.bind(this),
    getFavorites: function _get(cb) {
      var postCmd = 'include=agent&where=' + escape(JSON.stringify({consumer: apiService.getPointer($rootScope.consumer.objectId, 'Consumer')}));
      return apiService
      .favorite.get(postCmd)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        // _faves = data.results;
        // if ( typeof(cb) === 'function' ) { return cb(null, _faves); }
      }).error(console.error.bind(console));
    }.bind(this),
    addFavorite: function _save(favorite) {
      var self = this;
      return apiService
      .favorite[favorite.objectId ? 'update' : 'create'](favorite)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
      })
      .error(console.error.bind(console));
    }.bind(this),
    updateFavorite: function _save(favorite) {
      var self = this;
      return apiService
      .favorite.update(favorite)
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
      })
      .error(console.error.bind(console));
    }.bind(this)
  };
}];
