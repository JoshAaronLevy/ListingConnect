var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var AgentController = module.exports = [
"$http", "$scope", "$sce", "apiService", "consumerService", "authService", "agentService",
function($http, $scope, $sce, apiService, consumerService, authService, agentService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  var user = $scope.$root.user;

  $scope.loadAgents = function() {
    $('#agentLoadingModal').modal();
    return consumerService
    .getAgents()
    .success(data => {
      data = data.data || data;
      $scope.agents = data.results;
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console));
  };

  $scope.loadDiscreet = function() {
    consumerService.getAgents()
    .then(data => {
      data = data.data || data;
      $scope.messages = data && data.results ? data.results : data;
    });
  };

  $scope.savedAgent = function() {
    $('#saveSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.messagedAgent = function() {
    $('#messageSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.faveAgent = function(agent, favorite) {
    agent = agent || $scope.$root.selectedAgent;
    var faveAdd = consumerService.addFavorite(_.extend({
      consumerSaved: "true",
      consumer: consumerService.getPointer($scope.$root.consumer.objectId, 'Consumer'),
      agent: consumerService.getPointer(agent.objectId, 'Agent')
    }, favorite))
    .then(data => {
      $('.modal.in').modal('toggle');
    }).then(data => {
      $scope.savedAgent();
    })
  };

  $scope.messageAgent = function(agent, message) {
    message = message || $scope.$root.message.objectId;
    agent = agent || $scope.$root.selectedAgent;
    var messageAdd = consumerService.createMessage(_.extend({
      createdBy: "Consumer",
      consumer: consumerService.getPointer($scope.$root.consumer.objectId, 'Consumer'),
      agent: consumerService.getPointer(agent.objectId, 'Agent'),
      message: $scope.$root.message.message
    }, message))
    .then(data => {
      $('.modal.in').modal('toggle');
    }).then(data => {
      $scope.messagedAgent();
    })
  };

  $scope.loadMessages = function() {
    return consumerService
    .getMessages()
    .success(data => {
      data = data.data || data;
      $scope.messages = data.results;
    })
    .error(console.error.bind(console));
  };

  if ($scope.$root.consumer && $scope.$root.consumer.objectId) {
    $scope.loadAgents();
  }

}];
