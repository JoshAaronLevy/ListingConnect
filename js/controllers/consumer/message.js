var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var MessageController = module.exports = [
"$http", "$scope", "$sce", "apiService", "consumerService", "authService",
function($http, $scope, $sce, apiService, consumerService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  var user = $scope.$root.user;
  var lastMessageDate = null;
  var currentUser = $scope.$root.user,
      targetUser = null;

  $scope.loadMessages = function() {
    $('#messageLoadingModal').modal();
    consumerService.getMessages()
    .then(data => {
      data = data.data || data;
      $scope.messages = data && data.results ? data.results : data;
      $('.modal.in').modal('toggle');
    });
  };

  $scope.loadDiscreet = function() {
    consumerService.getMessages()
    .then(data => {
      data = data.data || data;
      $scope.messages = data && data.results ? data.results : data;
    });
  };

  $scope.sentMsg = function() {
    $('#sentModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.deletedMsg = function() {
    $('#deletedModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.$root.viewMessage = function(message) {
    message = message || $scope.$root.selectedMessage;
    message.agent = consumerService.getPointer(message.agent.objectId, 'Agent');
    var messageViewed = consumerService.updateMessage(_.extend({
      consumerViewed: 'Yes'
    }, message))
    .success(data => {
      $scope.status = 'Saved Successfully!';
      $scope.loadDiscreet();
      $('.modal.in').modal('toggle');
    });
  };

  $scope.replyMessage = function(message) {
    message = message || $scope.$root.selectedMessage;
    message.agent = consumerService.getPointer(message.agent.objectId, 'Agent');
    var messageUpdate = consumerService.updateMessage(_.extend({
      consumerReplied: 'Yes'
    }, message))
    .then(data => {
      consumerService.createMessage({
        consumer: consumerService.getPointer($scope.$root.consumer.objectId, 'Consumer'),
        agent: consumerService.getPointer(message.agent.objectId, 'Agent'),
        createdBy: "Consumer",
        message: $scope.$root.message.message
      }).then(data => {
        $scope.loadDiscreet();
        $('.modal.in').modal('toggle');
      }).then(data => {
        $scope.sentMsg();
      })
    });
  };

  $scope.$root.removeMessage = function(message) {
    message = message || $scope.$root.selectedMessage;
    message.agent = consumerService.getPointer(message.agent.objectId, 'Agent');
    var messageKill = consumerService.updateMessage(_.extend({
      consumerDeleted: 'Yes'
    }, message))
    .success(data => {
      $scope.loadDiscreet();
      $('.modal.in').modal('toggle');
    }).then(data => {
        $scope.deletedMsg();
      });
  };

  $scope.selectAgent = function (agent) {
    console.warn('Agent selected', agent);
    $scope.$root.selectedAgent = agent;
    targetUser = $scope.$root.selectedAgent;
    $scope.loadMessages($scope.$root.consumer);
  };

  if ($scope.$root.consumer && $scope.$root.consumer.objectId) {
    $scope.loadMessages();
  }

}];
