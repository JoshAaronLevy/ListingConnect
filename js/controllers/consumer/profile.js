var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';

var ProfileController = module.exports = ["$http", "$scope", "$sce", "apiService", "consumerService", "authService", function($http, $scope, $sce, apiService, consumerService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  $scope.load = function() {
    $('#consumerLoadingModal').modal();
    consumerService.getConsumerProfile();
  };

  $scope.editBuyer = function() {
    var item = $scope.$root.consumer;
    return apiService
    .consumer.update(item)
    .success(data => {
      $scope.status = 'Saved Successfully!';
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console))
    .then(() => {
      $('#profileSuccessModal').modal();
    });
  };

  $scope.editSeller = function() {
    var item = $scope.$root.consumer;
    return apiService
    .consumer.update(item)
    .success(data => {
      $scope.status = 'Saved Successfully!';
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console))
    .then(() => {
      $('#profileSuccessModal').modal();
    });
  };

  $scope.profileSuccess = function() {
    location.reload();
  };

  $scope.$root.cities = [];
  $scope.$root.$watch('consumer.state', (newVal, oldVal) => {
    //CO: require('../../../data/CO')
    if ( newVal && newVal !== oldVal && newVal.length >= 2 ) {
      var stateCode = newVal.substr(0, 2).toUpperCase();
      $http({method:'get', url: '/data/' + stateCode + '.json'})
        .error(console.error.bind(console))
        .success(data => $scope.$root.cities = data);
    }
  });

  var years = $scope.years = {YEARS: require('../../../data/YEARS')};

  if ($scope.$root.consumer && $scope.$root.consumer.objectId) {
    $scope.load();
  }

}];
