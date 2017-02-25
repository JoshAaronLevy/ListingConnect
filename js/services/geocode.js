const NULL_GEOCODE = {lat: -0, lon: -0, 'null': true};

function getFullAddress(property, multiLine = false) {
  var addr = property.address1 || '';
  if ( property.address2 && property.address2.length >= 1 ) {
    addr += ' #' + property.address2 + '\n';
  }
  if ( property.city && property.city.length >= 1 ) {
    addr += ', ' + property.city;
  }
  if ( property.state && property.state.length >= 1 ) {
    addr += ' ' + property.state;
  }
  if ( property.zip && property.zip.length >= 1 ) {
    addr += ', ' + property.zip;
  }
  if ( !multiLine ) { addr = addr.replace(/\n/, ', '); }
  return addr;
}

var geoService = module.exports = ['$http', function($http) {
  var API_KEY = 'AIzaSyB2DHRjU9YLV6YLQUiolOtrRxBuFQAvn1U';
  return {
    getFullAddress: getFullAddress,

    query: function(address, callback) {
      if ( !address || address.length < 9 ) {
        return typeof(callback) !== 'function' ? Promise.resolve(NULL_GEOCODE) : callback(null, NULL_GEOCODE);
      }
      if ( typeof(address) === 'object' && address.city) {
        address = getFullAddress(address);
      }

      var _cached = localStorage.getItem('geocode_' + address);
      if ( _cached && _cached.length > 6 ) {
        return Promise.resolve(JSON.parse(_cached));
      }
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?region=us&address=';
      url += encodeURIComponent(address) + '&key=' + encodeURIComponent(API_KEY);

      return $http.get(url)
      .success(body => {
        var location = body;
        if(location && location.results && location.results.length >= 1 && location.results[0] && location.results[0].geometry) {
          var loc = location.results[0].geometry.location;
          loc = {lon: loc.lng, lat: loc.lat, results: location};
          localStorage.setItem('geocode_' + address, JSON.stringify(loc));
          return typeof(callback) !== 'function' ? Promise.resolve(loc) : callback(null, loc);
        } else {
          return typeof(callback) !== 'function' ? Promise.resolve(NULL_GEOCODE) : callback(null, NULL_GEOCODE, location);
        }
      }).error(console.error.bind(console));

    }
  };
}];
