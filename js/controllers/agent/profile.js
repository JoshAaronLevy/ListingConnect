var DEFAULT_UPLOAD_URI = 'http://virtualmls.com/REBeacons/upload.aspx';
var _ = require('lodash');
var ProfileController = module.exports = ["$http", "$scope", "$sce", "apiService", "agentService", "authService", function($http, $scope, $sce, apiService, agentService, authService) {

  $scope.trustAsHtml = $sce.trustAsHtml;

  $scope.load = function() {
    $('#profileLoadingModal').modal();
    agentService.getAgentProfile();
  };

  $scope.editAgent = function() {
    var item = $scope.$root.agent;
    agentService.saveProfile(item)
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
  $scope.$root.$watch('agent.state', (newVal, oldVal) => {
    //CO: require('../../../data/CO')
    if ( newVal && newVal !== oldVal && newVal.length >= 2 ) {
      var stateCode = newVal.substr(0, 2).toUpperCase();
      $http({method:'get', url: '/data/' + stateCode + '.json'})
        .error(console.error.bind(console))
        .success(data => $scope.$root.cities = data);
    }
  });

  $('#agent_photo_upload').cloudinary_upload_widget({
    cloud_name: 'ListingConnect',
    upload_preset: 'agentPhoto',
    folder: 'photo',
    multiple: false,
    thumbnails: false,
    theme: 'white',
    sources: ['local'],
    button_caption: 'Upload/Change Photo'
    // url: 'http://res.cloudinary.com/listingconnect/image/upload/photo/' + $scope.$root.agent.objectId + '.jpg',
    // public_id: $scope.$root.agent.objectId
  },
    function(error, result) {
      console.log(error, result);
      $('img.agent-photo').attr({src: result[0].secure_url});
      _.extend($scope.$root.agent, { photo: result[0].secure_url });
      return agentService.saveProfile();
    });

  $('#agent_logo_upload').cloudinary_upload_widget({
    cloud_name: 'ListingConnect',
    upload_preset: 'agentLogo',
    folder: 'logo',
    multiple: false,
    thumbnails: false,
    theme: 'white',
    sources: ['local'],
    button_caption: 'Upload/Change Logo'
    // url: 'http://res.cloudinary.com/listingconnect/image/upload/logo/' + $scope.$root.agent.objectId + '.jpg',
    // public_id: $scope.$root.agent.objectId
  },
    function(error, result) {
      console.log(error, result);
      $('img.agent-logo').attr({src: result[0].secure_url});
      _.extend($scope.$root.agent, { logo: result[0].secure_url });
      return agentService.saveProfile();
    });

  $scope.editorOptions = {
    language: 'en',
    // uiColor: '#fff',
    toolbar: [
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt' ] },
      { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
      { name: 'insert', items: [ 'Table', 'SpecialChar', 'HorizontalRule' ] },
      { name: 'tools', items: [ 'Maximize' ] },
      { name: 'document', items: [ 'Source' ] },
      '/',
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ] },
      { name: 'paragraph', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
      { name: 'styles', items: [ 'Styles', 'Format' ] }
    ]
  };

  // // Instance the tour
  // var tour = new Tour({
  //   steps: [
  //   {
  //     element: "#Profile",
  //     title: "Title of my step",
  //     content: "Content of my step"
  //   },
  //   {
  //     element: "#my-other-element",
  //     title: "Title of my step",
  //     content: "Content of my step"
  //   }
  // ]});

  // $scope.showTour = function() {
  //   tour.start();
  // };

  if ($scope.$root.agent && $scope.$root.agent.objectId) {
    $scope.load();
  }

}];
