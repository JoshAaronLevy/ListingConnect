var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var FavoriteController = module.exports = [
"$http", "$scope", "$sce", "apiService", "consumerService", "authService",
function($http, $scope, $sce, apiService, consumerService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  // $scope.$root.favorite = {};

  var user = $scope.$root.user;

  $scope.load = function() {
    $('#faveLoadingModal').modal();
    return consumerService
    .getFavorites()
    .success(data => {
      data = data.data || data;
      $scope.favorites = data.results;
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console));
  };

  $scope.loadProfile = function() {
    consumerService.getProfile();
  };

  $scope.$root.removeFave = function(favorite) {
    favorite = favorite || $scope.$root.selectedFave;
    favorite.consumerSaved = "false";
    favorite.consumer = consumerService.getPointer($scope.$root.consumer.objectId, 'Consumer');
    favorite.agent = consumerService.getPointer(favorite.agent.objectId, 'Agent');
    var faveDelete = consumerService.updateFavorite(_.extend({
      consumerSaved: "false"
    }, favorite))
    .then(data => {
      $('.modal.in').modal('toggle');
      $scope.loadDiscreet();
    }).then(data => {
      $scope.removedAgent();
    })
  };

  $scope.loadDiscreet = function() {
    consumerService.getFavorites()
    .then(data => {
      data = data.data || data;
      $scope.favorites = data && data.results ? data.results : data;
    });
  };

  $scope.removedAgent = function() {
    $('#removeSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.messageAgent = function(favorite, message) {
    message = message || $scope.$root.message.objectId;
    favorite = favorite || $scope.$root.selectedFave;
    var messageAdd = consumerService.createMessage(_.extend({
      createdBy: "Consumer",
      consumer: consumerService.getPointer($scope.$root.consumer.objectId, 'Consumer'),
      agent: consumerService.getPointer(favorite.agent.objectId, 'Agent'),
      message: $scope.$root.message.message
    }, message))
    .then(data => {
      $('.modal.in').modal('toggle');
    }).then(data => {
      $scope.messagedAgent();
    })
  };

  $scope.messagedAgent = function() {
    $('#messageSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  if ($scope.$root.consumer && $scope.$root.consumer.objectId) {
    $scope.load();
  }

}];
