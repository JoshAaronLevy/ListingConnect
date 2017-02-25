var express = require('express');
var app = module.exports = express();
var Proxy = require('./lib');
var config = require('../../config');
var log = require('debug')('lc:proxy');

module.exports.github = new Proxy({
  endpoint: '/github',
  host: 'https://api.github.com',
  headers: {
    'User-Agent': 'dhigginbotham-proxy-client',
    'Accept': 'application/vnd.github.v3+json'
  }
}, app);

module.exports.parse = new Proxy({
  endpoint: '/parse',
  host: 'https://api.parse.com/1',
  headers: {
    'X-Parse-Application-Id': config.parse.appKey,
    'X-Parse-REST-API-Key': config.parse.restKey,
    'Content-Type': 'application/json'
  },
  timeout: config.proxyTimeout.parse,
  preware: function(req,res,next) {
    log('preware hit', req._proxyObject);
    
    if (req._proxyObject && req.user) {
      log('SESSION TOKEN:', req.user.token, req.user);
      req._proxyObject.headers['X-Parse-Session-Token'] = req.user.token;
    }
    return next();
  }
}, app);
