var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var MessageController = module.exports = [
"$http", "$scope", "$sce", "apiService", "agentService", "authService",
function($http, $scope, $sce, apiService, agentService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  var user = $scope.$root.user;
  var lastMessageDate = null;
  var currentUser = $scope.$root.user,
      targetUser = null;

  $scope.loadMessages = function() {
    $('#messageLoadingModal').modal();
    agentService.getMessages()
    .then(data => {
      data = data.data || data;
      $scope.messages = data && data.results ? data.results : data;
      $('.modal.in').modal('toggle');
    });
  };

  $scope.loadDiscreet = function() {
    agentService.getMessages()
    .then(data => {
      data = data.data || data;
      $scope.messages = data && data.results ? data.results : data;
    });
  };

  $scope.$root.viewMessage = function(message) {
    message = message || $scope.$root.selectedMessage;
    message.consumer = agentService.getPointer(message.consumer.objectId, 'Consumer');
    var messageViewed = agentService.updateMessage(_.extend({
      agentViewed: 'Yes'
    }, message))
    .success(data => {
      $scope.status = 'Saved Successfully!';
      $scope.loadDiscreet();
      $('.modal.in').modal('toggle');
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

  $scope.replyMessage = function(message) {
    message = message || $scope.$root.selectedMessage;
    message.consumer = agentService.getPointer(message.consumer.objectId, 'Consumer');
    var messageUpdate = agentService.updateMessage(_.extend({
      agentReplied: 'Yes'
    }, message))
    .then(data => {
      agentService.createMessage({
        agent: agentService.getPointer($scope.$root.agent.objectId, 'Agent'),
        consumer: agentService.getPointer(message.consumer.objectId, 'Consumer'),
        createdBy: "Agent",
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
    message.consumer = agentService.getPointer(message.consumer.objectId, 'Consumer');
    var messageKill = agentService.updateMessage(_.extend({
      agentDeleted: 'Yes'
    }, message))
    .success(data => {
      $scope.loadDiscreet();
      $('.modal.in').modal('toggle');
    }).then(data => {
        $scope.deletedMsg();
      });
  };

  $scope.selectLead = function (lead) {
    console.warn('Lead selected', lead);
    $scope.$root.selectedLead = lead;
    targetUser = $scope.$root.selectedLead;
    $scope.loadMessages($scope.$root.agent);
  };

  if ($scope.$root.agent && $scope.$root.agent.objectId) {
    $scope.loadMessages();
  }

}];
