var config = require('../../config');

const TIMEOUT = config.localTimeout || 5000;

var messageService = module.exports = ['$http', '$rootScope', 'apiService', 'Cache', function($http, $rootScope, apiService, Cache) {
  var _ = require('lodash');
  var currentUser = Cache.cache.bind(null, 'user');

  return {
    getPointer: apiService.getPointer,
    
    get: function _get({date, user, toUser}, cb) {
      date = date || new moment().add(-31, 'days').toDate();
      user = user || currentUser();
      if ( !toUser ) { throw new Error('Parameter toUser required for getMessages({toUser: ...})'); }
      toUser = apiService.getPointer(toUser, '_User');
      user = apiService.getPointer(user, '_User');
      var query = {$or: [
        {'sentTo': user, 'sentFrom': toUser},
        {'sentTo': toUser, 'sentFrom': user}
      ]}
      if (date) {
        query.createdAt = {$gt: date};
      }
      var postCmd = 'order=createdAt&include=&where=' + escape(JSON.stringify(query));
      return apiService
      .message.get(postCmd)
      .success(data => {
        data = data.results || data;
        data = data.data || data;
        $rootScope.status = 'Loaded server data.';
        // if ( Array.isArray($rootScope.currentMessages) ) {
        //   $rootScope.currentMessages = $rootScope.currentMessages.concat(data);
        // }
        
        // add new msgs below!
        if ( Array.isArray(data) ) {
          var currIds = _.pluck($rootScope.currentMessages, 'objectId');
          data.forEach(msg => {
            if ( currIds.indexOf(msg.objectId) <= -1 ) {
              $rootScope.currentMessages.push(msg);
            }
          });          
        }
        if ( typeof(cb) === 'function' ) { return cb(null, data); }
      }).error(console.error.bind(console));
    }.bind(this),

    send: function _create({message, user, toUser}, cb) {
      user = user || currentUser();
      if ( !message ) { throw new Error('Parameter message required for sendMessage({message: \'message\'})'); }
      if ( !toUser ) { throw new Error('Parameter toUser required for sendMessage({toUser: ...})'); }

      toUser = apiService.getPointer(toUser, '_User');
      user = apiService.getPointer(user, '_User');
      return apiService
      .message.create({message: message, 'sentTo': toUser, 'sentFrom': user})
      .success(data => {
        data = data.data || data;
        $rootScope.status = 'Saved Successfully!';
      })
      .error(console.error.bind(console));
    }.bind(this)
  };

}];
