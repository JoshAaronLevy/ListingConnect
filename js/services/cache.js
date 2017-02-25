module.exports = ['$rootScope', CacheService];

function CacheService($rootScope) {
  return {'cache': cache};
  
  function cache(name, value) {
    if (!name) { throw new Error('Cache getter/setter requires a `name`'); }
    if (value === null) {
      // remove value
      localStorage.setItem(name, null);
      $rootScope[name] = null;
    } else if (value) {
      // set value
      localStorage.setItem(name, JSON.stringify(value));
      $rootScope[name] = value;
    } else if (!$rootScope[name]) {
      // not in root scope, load from localstorage
      var str = localStorage.getItem(name);
      if ( str ) {
        $rootScope[name] = JSON.parse(str);
      }
    }
    // return whatever is in rootScope for `name`
    return $rootScope[name];
  }
}
