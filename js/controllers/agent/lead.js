var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var LeadController = module.exports = [
"$http", "$scope", "$sce", "apiService", "consumerService", "authService", "agentService",
function($http, $scope, $sce, apiService, consumerService, authService, agentService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  var user = $scope.$root.user;

  // $scope.openPayment = function() {
  //   var handler = StripeCheckout.configure({
  //     key: 'pk_test_6vSqbLmjoMSezUrdLj8dcAAn',
  //     image: '/img/documentation/checkout/marketplace.png',
  //     locale: 'auto',
  //     token: function(token) {
  //       // Use the token to create the charge with a server-side script.
  //       // You can access the token ID with `token.id`
  //     }
  //   });

  //   $('#customButton').on('click', function(e) {
  //     // Open Checkout with further options
  //     handler.open({
  //       name: 'ListingConnect',
  //       description: '2 widgets',
  //       amount: 2000
  //     });
  //     e.preventDefault();
  //   });

  //   // Close Checkout on page navigation
  //   $(window).on('popstate', function() {
  //     handler.close();
  //   });
  // };

  $scope.$root.loadLeads = function() {
    $('#leadLoadingModal').modal();
    return agentService
    .getLeads()
    .success(data => {
      data = data.data || data;
      $scope.$root.matchedConsumers = data.results;
      $('.modal.in').modal('toggle');
    })
    .error(console.error.bind(console));
  };

  $scope.faveLead = function(consumer, favorite) {
    consumer = consumer || $scope.$root.selectedLead;
    var faveAdd = agentService.addFavorite(_.extend({
      agentSaved: "true",
      agent: agentService.getPointer($scope.$root.agent.objectId, 'Agent'),
      consumer: agentService.getPointer(consumer.objectId, 'Consumer')
    }, favorite))
    .then(data => {
      $('.modal.in').modal('toggle');
    }).then(data => {
      $scope.savedLead();
    })
  };

  $scope.savedLead = function() {
    $('#saveSuccessModal').modal();
    setTimeout(function () {
      $('.modal.in').modal('toggle');
    }, 2500);
  };

  $scope.messageLead = function(consumer, message) {
    message = message || $scope.$root.message.objectId;
    consumer = consumer || $scope.$root.selectedLead;
    var messageAdd = agentService.createMessage(_.extend({
      createdBy: "Agent",
      agent: agentService.getPointer($scope.$root.agent.objectId, 'Agent'),
      consumer: agentService.getPointer(consumer.objectId, 'Consumer'),
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
    $scope.$root.loadLeads();
  }

}];
