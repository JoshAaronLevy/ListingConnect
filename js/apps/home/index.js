var _ = window._ ? window._ : require('lodash');
var app = window.app ? window.app : angular.module("app", []);
window.app = app;

app
.factory('Cache', require('../../services/cache'))
.factory('apiService', require('../../services/apiService'))
.factory('authService', require('../../services/auth'))
.factory('agentService', require('../../services/agent/agent'))
.factory('consumerService', require('../../services/consumer/consumer'))

.controller('AuthController', require('../../controllers/auth'))
.controller('MainController', require('../../controllers/main'));
