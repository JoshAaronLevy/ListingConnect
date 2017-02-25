var _ = window._ ? window._ : require('lodash');
var app = window.app ? window.app : angular.module("app", ['ngCkeditor', 'ngSanitize', 'ui.select']);
window.app = app;

app
// .directive('messages', '../../directives/messages')
.factory('Cache', require('../../services/cache'))
.factory('apiService', require('../../services/apiService'))
.factory('authService', require('../../services/auth'))
.factory('consumerService', require('../../services/consumer/consumer'))
.factory('agentService', require('../../services/agent/agent'))

// .factory('consumerProfile', require('../../services/consumer/profile'))
// .factory('matchService', require('../../services/consumer/match'))
// .factory('favoriteService', require('../../services/consumer/favorite'))
// .factory('messageService', require('../../services/consumer/message'))
.factory('geoService', require('../../services/geocode'))

.controller('AuthController', require('../../controllers/auth'))
.controller('MainController', require('../../controllers/main'))
.controller('ProfileController', require('../../controllers/consumer/profile'))
.controller('MessageController', require('../../controllers/consumer/message'))
.controller('FavoriteController', require('../../controllers/consumer/favorite'))
.controller('AgentController', require('../../controllers/consumer/agent'));
// .controller('DashboardController', require('../../controllers/buyer/dashboard'));
