var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var FavoriteController = module.exports = [
"$http", "$scope", "$sce", "apiService", "agentService", "authService",
function($http, $scope, $sce, apiService, agentService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  // $scope.$root.favorite = {};

  var user = $scope.$root.user;

  $scope.load = function() {
    $('#faveLoadingModal').modal();
    return agentService
    .getFavorites()
    .success(data => {
      data = data.data || data;
      $scope.favorites = data && data.results ? data.results : data;
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console));
  };

  $scope.$root.removeFave = function(favorite) {
    favorite = favorite || $scope.$root.selectedFave;
    favorite.agentSaved = "false";
    favorite.agent = agentService.getPointer($scope.$root.agent.objectId, 'Agent');
    favorite.consumer = agentService.getPointer(favorite.consumer.objectId, 'Consumer');
    var faveDelete = agentService.updateFavorite(_.extend({
      agentSaved: "false"
    }, favorite))
    .then(data => {
      $('.modal.in').modal('toggle');
      $scope.loadDiscreet();
    }).then(data => {
      $scope.removedFave();
    })
  };

  $scope.loadDiscreet = function() {
    agentService.getFavorites()
    .then(data => {
      data = data.data || data;
      $scope.favorites = data && data.results ? data.results : data;
    });
  };

  $scope.removedFave = function() {
    $('#removeSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.messageLead = function(favorite, message) {
    message = message || $scope.$root.message.objectId;
    favorite = favorite || $scope.$root.selectedFave;
    var messageAdd = agentService.createMessage(_.extend({
      createdBy: "Agent",
      agent: agentService.getPointer($scope.$root.agent.objectId, 'Agent'),
      consumer: agentService.getPointer(favorite.consumer.objectId, 'Consumer'),
      message: $scope.$root.message.message
    }, message))
    .then(data => {
      $('.modal.in').modal('toggle');
    }).then(data => {
      $scope.messagedLead();
    })
  };

  $scope.messagedLead = function() {
    $('#messageSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  if ($scope.$root.agent && $scope.$root.agent.objectId) {
    $scope.load();
  }

}];
