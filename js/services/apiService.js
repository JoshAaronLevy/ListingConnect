var config = require('../../config');

var apiServiceFactory = module.exports = ['$http', function($http) {

  var proxiedClasses = ['auth'];

  var coreClasses = [
    'logout', 'login', 'users', 'roles',
    'functions', 'apps', 'events', 'sessions'
  ];

  var classes = [
    'Agent', 'Consumer', 'Buyer', 'Seller', 'Message', 'Question', 'Relationship', 'Favorite', 'Lead', 'Match'
  ];

  var defaultOptions = {
    // headers: {
    //   'X-Parse-Revocable-Session': 1,
    //   'X-Parse-Application-Id': config.parse.appKey,
    //   'X-Parse-Client-Key': config.parse.clientKey,
    //   'Content-Type': 'application/json'
    // }
  };

  var services = {};// This side-effect is not being executed in the way it appears
  services.getPointer = function getPointer(objectId, className = '_User') {
    if ( className.toLowerCase() === 'user' ) { className = '_User'; } // Parse B.S. hackery
    if ( objectId.__type === 'Pointer' ) {
      if ( objectId.className !== className ) {
        console.error(`Uh oh!!! WARNING: Cannot convert pointer between ${objectId.className} and ${className}`);
      } 
      return objectId; 
    }
    if ( objectId && typeof(objectId.objectId) === 'string' ) { objectId = objectId.objectId; }
    
    if ( !objectId || (''+objectId).length < 5 ) { throw new Error('Cannot Create Pointer. Invalid or Null objectId.'); }
    return {
      "__type": "Pointer",
      "className": className,
      "objectId": objectId
    };
  };
  var classProcessor = function(done) {
    var cp = Array.prototype.slice.call(classes).concat(coreClasses, proxiedClasses);
    var tick = function(next) {
      var properName = next[0].toLowerCase() + next.substr(1,next.length-1),
        uri = (config.apiServer + 'parse/' + (coreClasses.indexOf(next) > -1 ? '' : 'classes/') + next);
        if (proxiedClasses.indexOf(next) > -1){
          uri = config.apiServer + next;
        }
      services[properName] = {
        className: next,
        properName: properName,
        uri: uri,
        // uri: config.apiServer + (proxiedClasses.indexOf(next) ? 'parse/' : '') + next,
        get: function(obj, fn) {
          obj = (typeof obj === 'object' ? obj : obj);
          var opts = {
            url: services[this.properName].uri + (obj && obj.objectId ? '/' + obj.objectId : '?' + obj)
          };
          return $http($.extend({}, defaultOptions, opts, obj), fn);
        },
        create: function(obj, fn) {
          obj = (typeof obj === 'object' ? obj : {});
          var opts = {
            url: services[this.properName].uri,
            data: (obj.data ? obj.data : obj),
            method: 'POST'
          };
          console.log('Creating', opts);
          return $http($.extend({}, defaultOptions, opts), fn);
        },
        signup: function(obj, fn) {
          obj = (typeof obj === 'object' ? obj : {});
          var opts = {
            url: config.apiServer + 'auth/signup',
            data: (obj.data ? obj.data : obj),
            method: 'POST'
          };
          console.log('Creating', opts);
          return $http($.extend({}, defaultOptions, opts), fn);
        },
        send: function (obj, fn) {
          return this.create.apply(this, Array.prototype.slice.call(arguments));
        },
        update: function(obj, fn) {
          obj = (typeof obj === 'object' ? obj : {});
          if (! obj || !obj.objectId) {console.warn('bad obj', obj); throw new Error('Update/PUT requires id for ' + properName);}
          var opts = {
            url: services[this.properName].uri + (obj.objectId ? '/' + obj.objectId : ''),
            data: obj.data ? obj.data : obj,
            method: 'PUT'
          };
          return $http($.extend({}, defaultOptions, opts), fn);
        },
        remove: function(obj, fn) {
          obj = (typeof obj === 'object' ? obj : {});
          if (! obj || !obj.objectId) { throw new Error('Remove/DELETE requires id for ' + properName);}
          var opts = {
            url: services[this.properName].uri + (obj.objectId ? '/' + obj.objectId : ''),
            method: 'DELETE'
          };
          return $http($.extend({}, defaultOptions, opts, obj), fn);
        }
      };

      return (cp.length) ? tick(cp.shift()) : done(services);
    };
    tick(cp.shift());
  };

  classProcessor(function(serv) {
    // .. do any autowiring or stuffs here
    console.log('Setup Services:', serv);

  });

  window.apiService = services;
  return services;

}];
