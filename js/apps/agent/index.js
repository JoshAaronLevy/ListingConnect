var _ = window._ ? window._ : require('lodash');
var app = window.app ? window.app : angular.module("app", ['ngCkeditor', 'ngSanitize', 'ui.select']);
window.app = app;

app
// .directive('messages', require('../../directives/messages'))

.factory('Cache', require('../../services/cache'))
.factory('apiService', require('../../services/apiService'))
.factory('authService', require('../../services/auth'))
.factory('agentService', require('../../services/agent/agent'))
.factory('consumerService', require('../../services/consumer/consumer'))

// .factory('messageService', require('../../services/message'))
.factory('geoService', require('../../services/geocode'))

.controller('AuthController', require('../../controllers/auth'))
.controller('MainController', require('../../controllers/main'))
.controller('ProfileController', require('../../controllers/agent/profile'))
.controller('MessageController', require('../../controllers/agent/message'))
.controller('FavoriteController', require('../../controllers/agent/favorite'))
.controller('LeadController', require('../../controllers/agent/lead'));
// .controller('DashboardController', require('../../controllers/agent/dashboard'));
