var apiServices = (function(w,d,$) {

  var classes = [
    'Agent', 'Seller', 'Favorite', 'Buyer', 'Message',
    'Relationship', 'Role', 'Statistics', 'TestObject'
  ];

  var defaultOptions = {};

  var services = {};

  var xhr = function(obj, fn) {
    console.log(obj);
  };

  var classProcessor = function(done) {
    var cp = Array.prototype.slice.call(classes);
    var tick = function(next) {
      var properName = next[0].toLowerCase() + next.substr(1,next.length-1);
      services[properName] = {
        className: next,
        uri: '/parse/classes/' + next,
        // generic get request, autowired
        get: function(obj, fn) {
          obj = (typeof obj == 'object' ? obj : {});
          xhr({
            url: services[properName].uri + (obj.id ? '/' + obj.id : ''),
            method: 'get'
          }, fn);
        },
        // generic post request, autowired
        post: function(obj, fn) {
          obj = (typeof obj == 'object' ? obj : {});
          xhr({
            url: services[properName].uri + (obj.id ? '/' + obj.id : ''),
            data: (obj.data ? obj.data : null),
            method: 'post'
          }, fn);
        }
      };
      return (cp.length) ? tick(cp.shift()) : done(services);
    };
    tick(cp.shift());
  };

  classProcessor(function(serv) {
    // .. do any autowiring or stuffs here
    console.log(serv);
  });

  return services;

})(window,document,jQuery);