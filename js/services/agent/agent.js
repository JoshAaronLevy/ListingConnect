var _ = require('lodash');
var config = require('../../../config');

var agentService = module.exports = ['$http', '$rootScope', 'apiService', 'Cache', function($http, $rootScope, apiService, Cache) {

	var _cached = null,
		_faves = null;
	var current = Cache.cache.bind(null, 'agent');


	return {
		current: current,

		getPointer: apiService.getPointer,

		getProfile: function(callback) {
			var postCmd = 'where=' + escape(JSON.stringify({parent: apiService.getPointer($rootScope.user.objectId)}));
			return apiService
			.agent.get(postCmd)
			.success(data => {
				console.warn('Agent.getProfile', data);
				data = data.payload ? data.payload : data;
				data = data.results && data.results.length > 0 ? data.results[0] : data;
				if (!data || !data.objectId){
					console.error('Invalid server response for Agent', arguments);
				} else {
					current(data);
				}
			});
		}.bind(this),
		getAgentProfile: function(callback) {
			var postCmd = 'where=' + encodeURIComponent(JSON.stringify({parent: apiService.getPointer($rootScope.user.objectId)}));
			return apiService
			.agent.get(postCmd)
			.success(data => {
				console.warn(data);
				data = data.payload ? data.payload : data;
				data = data.results && data.results.length > 0 ? data.results[0] : data;
				if (!data || !data.objectId){
					console.error('Invalid server response for Agent', arguments);
				} else {
					current(data);
					$('.modal.in').modal('toggle');
				}
			});
		}.bind(this),
		saveProfile: function _save() {
			var item = $rootScope.agent;
			// var self = this;
			return apiService
			.agent.update(item)
			.success(data => {
				if ($rootScope.agent.objectId) {
					data = data.data || data;
					$rootScope.status = 'Saved Successfully!';
					// $('.modal.in').modal('toggle');
					// location.reload();
				} else {
					$rootScope.error = 'Unable to save Agent data';
				}
			})
			.error(console.error.bind(console));
		}.bind(this),
		// getLeads: function _get(cb) {
		//   var state = $rootScope.agent.state;
		//   // var cities = [];
		//   //   if (agent && agent.cities) {
		//   //     cities = cities.concat(agent.cities);
		//   //   };
		//   // // Note: assert(cities.length === 3);
		//   // // find matching consumers with any of the cities of the current agent
		//   var postCmd = 'include=consumer&where=' + encodeURIComponent(JSON.stringify({'agent': apiService.getPointer($rootScope.agent.objectId, 'Agent')}));
		//   return apiService
		//   .match.get(postCmd)
		//   .success(data => {
		//     data = data.results || data;
		//     data = data.data || data;
		//     $rootScope.status = 'Loaded server data.';
		//     $rootScope.matchedConsumers = data.map(match => match.consumer);
		//     if ( typeof(cb) === 'function' ) { return cb(null, data); }
		//     $('.modal.in').modal('toggle');
		//   }).error(console.error.bind(console));
		// }.bind(this),
		getLeads: function _get(cb) {
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
			// // find matching agents with any of the cities of the current agent
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
		getMessages: function _get(cb) {
			var postCmd = 'include=consumer&where=' + escape(JSON.stringify({agent: apiService.getPointer($rootScope.agent.objectId, 'Agent')}));
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
			var postCmd = 'include=consumer&where=' + escape(JSON.stringify({agent: apiService.getPointer($rootScope.agent.objectId, 'Agent')}));
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
