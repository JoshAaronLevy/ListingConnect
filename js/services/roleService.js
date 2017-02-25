module.exports = ['$rootScope', '$http', 'apiService', function ($rootScope, $http, apiService) {
  return {
    mapping: {
      // user.role -> table
      'u7i8jhljbo': 'agent',
      'uNh39OkVYS': 'consumer'
    },
    join: function _join(pointerType, pointerId, targetType, targetId) {

    },
    resolve: function _resolve(user, callback) {
      var roleId = user && user.role && user.role.objectId;
      var tableName = this.mapping[roleId];
      if ( !apiService || !apiService[tableName] ) {
        alert('Failed: Service Client Invalid!');
      }
      apiService[tableName]
      .get('where=' + escape(JSON.stringify({user: user.objectId})))
      .success(data => {
        if (data.results && data.results.length === 1) {
          localStorage.setItem(tableName, JSON.stringify(data.results[0]));
        } else {
          alert('Failed: Unexpected response!');
        }
      }).error(err => console.error.bind(console));

    }
  };
}];
