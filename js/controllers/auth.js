var _ = require('lodash');
var AuthController = module.exports = ["$scope", "$http", "$rootScope", "apiService", "authService", "Cache", function($scope, $http, $rootScope, apiService, authService, Cache) {

  $scope.login = function(username, password) {
    $('#loginLoadingModal').modal();
    $scope.error = null;
    $scope.status = 'Logging in...';
    return authService.login(username, password)
    .then(function() {
      var user = Cache.cache('user');
      if (!user || !user.objectId){
        $scope.error = 'Invalid login and password';
        console.error('Invalid server response', user);
      } else {
        $scope.success = 'Retrieving account information. Please wait...';
      }
      // last step - redirect
      if ( $rootScope.agent ) {
        window.location = '/agent/profile.html';
      } else if ($rootScope.consumer) {
        window.location = '/consumer/profile.html';
      } else {
        console.error('Unknown Login State - Check Records for current user: Agent or Consumer');
      }
    })
  };

  function errHandler(err) {
    $('#loginErrorModal').modal();
    console.error('Err.Handler:', err, $scope);
    $scope.status = null;
    $scope.error = err && err.message || err;
  }

  function doUserSignup(defaults) {
    $('#userSignupModal').modal();
    var user = _.extend(defaults, $scope.signupUser);
    return apiService
    .users.signup(_.pick(user, ['agentID', 'buyer', 'createdAt', 'displayName', 'email', 'emailVerified', 'firstName', 'lastName', 'newsletter', 'objectId', 'password', 'phone', 'profileName', 'roles', 'role', 'termsAgreed', 'emailUpdates', 'updatedAt', 'username']))
    .error(errHandler)
    .success((data) => {
      data = data.payload ? data.payload : data;
      if (!data || !data.objectId){
        $scope.error = 'Unable to sign up. Please double check the fields above. If you have already signed up, please log in.';
        console.error('Invalid server response', arguments);
      } else {
        $rootScope.user = data;
        $rootScope.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        $scope.status = 'Successfully signed up!';
      }
    });
  };

  $scope.agentSignup = function() {
    $('#agentSignupModal').modal();
    // parent: apiService.getPointer($rootScope.user.objectId, '_User'),
    var ag = _.extend({
      role: apiService.getPointer('u7i8jhljbo', '_Role')
    }, $scope.signupUser);
    return doUserSignup(ag)
    .then(results => {
      ag = _.extend({
        parent: apiService.getPointer($rootScope.user.objectId, '_User'),
        // displayName: String($rootScope.user.firstName + ' ' + $rootScope.user.lastName),
        companyName: $rootScope.user.companyName,
        companyEmail: $rootScope.user.username,
        agentID: $rootScope.user.agentID,
        emailUpdates: $scope.signupUser.emailUpdates,
        subscription: 'Promo',
        leadCredits: 0,
      }, _.pick(ag, ['firstName', 'lastName', 'state', 'parent', 'agentID', 'companyName', 'companyEmail', 'subscription', 'displayName', 'leadCredits', 'emailUpdates']));
      return apiService
      .agent.create(ag)
      .success(data => {
        console.warn('agent.get', data);
        data = data.payload ? data.payload : data;
        if (!data || !data.objectId){
          $scope.error = 'Unable to sign up. Please double check the fields above. If you have already signed up, please log in.';
          console.error('Invalid server response', arguments);
        } else {
          $scope.success = 'Successfully signed up!';
        }
      })
      // .error(errHandler)
      .then(() => authService.getRoles());
    });
  };


  $scope.buyerSignup = function _buyerSignup() {
    $('#consumerSignupModal').modal();
    return doUserSignup({
      role: apiService.getPointer('uNh39OkVYS', '_Role'),
      profileName: undefined,
      buyer: undefined,
    })
    .then(createBuyerFromUser)
    .then(() => authService.getRoles());
    // .error(errHandler);
  }


  $scope.sellerSignup = function _sellerSignup() {
    $('#consumerSignupModal').modal();
    return doUserSignup({
      role: apiService.getPointer('uNh39OkVYS', '_Role'),
      profileName: undefined,
      buyer: undefined
    })
    .then(createSellerFromUser)
    // If buyer option set, create buyer
    // .then(results => $scope.signupUser.buying === 'Yes' ? createBuyerFromUser(results) : results)
    .then(() => authService.getRoles());
  }

  function createSellerFromUser(user) {
    var sl = _.extend({
      parent: apiService.getPointer($rootScope.user.objectId, '_User'),
      email: $scope.signupUser.username,
      profileName: $scope.signupUser.profileName,
      emailUpdates: $scope.signupUser.emailUpdates,
      buyer: $scope.signupUser.buyer,
      seller: "Yes",
    },
    _.pick($scope.signupUser, ['buyer', 'seller', 'state', 'email', 'parent', 'profileName', 'emailUpdates']));
    return apiService
    .consumer.create(sl)
    .success(data => {
      console.warn(data);
      data = data.payload ? data.payload : data;
      if (!data || !data.objectId){
        $scope.error = 'Unable to sign up. Please double check the fields above. If you have already signed up, please log in.';
        console.error('Invalid server response', arguments);
      } else {
        $scope.success = 'Successfully signed up!';
      }
    })
  }
  function createBuyerFromUser (results) {
    var by = _.extend({
      parent: apiService.getPointer($rootScope.user.objectId, '_User'),
      email: $scope.signupUser.username,
      profileName: $scope.signupUser.profileName,
      emailUpdates: $scope.signupUser.emailUpdates,
      buyer: "Yes",
      seller: "No",
    }, _.pick($scope.signupUser, ['buyer', 'seller', 'state', 'email', 'parent', 'profileName', 'emailUpdates']));
    return apiService
    .consumer.create(by)
    .success(data => {
      console.warn(data);
      data = data.payload ? data.payload : data;
      if (!data || !data.objectId){
        $scope.error = 'Unable to sign up. Please double check the fields above. If you have already signed up, please log in.';
        console.error('Invalid server response', arguments);
      } else {
        $scope.success = 'Successfully signed up!';
      }
    });
  }

  $scope.$root.logout = function(target) {
    localStorage.clear();
    console.log('apiService', apiService);
    if ( target ) {
      window.self.location.href = '/signup.html';
    } else {
      window.self.location.href = '/index.html?target=' + escape(target);
    }
  };

  function getUserPointer(objectId) {
    return {
      "__type": "Pointer",
      "className": "_User",
      "objectId": objectId
    };
  }

}];
