var express = require('express');
var router = module.exports = express.Router();
var proxy = require('./').parse;
var config = require('../../config');
var request = require('request');
var url = require('url');
var _ = require('lodash');
var log = require('debug')('lc:proxy:classes');
var logReq = require('debug')('lc:proxy:req');
var logResp = require('debug')('lc:proxy:reply');

router
.route('/classes/:className/:id?')
    .all(function (req, res, next) {
      var uri = url.parse(req.originalUrl);
      var link = 'https://api.parse.com/1/classes/'+req.params.className+'/' + (req.params.id ? req.params.id : '') + (uri.query ? '?' + uri.query : '');
      var opts = req.body && Object.keys(req.body).length >= 1 ? {'json': req.body} : {};
      var m = req.method.toLowerCase();
      var headers = {
        'X-Parse-Revocable-Session': 1,
        'X-Parse-Application-Id': process.env.PARSE_APP_KEY || 'gp5pTelFu2HAZb4JQcrNVhLVAjmTwn7ysUF8ySSe',
        'X-Parse-REST-API-Key': process.env.PARSE_REST_KEY || 'GM9jnkdWHxGxhhUxSZ6NsiqVwSAI9iybJmgX2DIm',
        'X-Parse-Master-Key': process.env.PARSE_MASTER_KEY || '4DHToK3rkfQM6CqijZgCu4K4GShIy8LfnxlykWM6',
        'Content-Type': 'application/json'
      };
      opts = _.extend({'headers': headers}, opts);
      opts.url = link;
      logReq('PARSE REQUEST ', m, opts);
      request[m](opts, function _handleRequest(err, response, body) {
        body = JSON.parse(body);
        logResp('Resp headers', response.headers);
        logResp('Resp body', typeof body, body);
        if (body && body.error) {
          return res.status(200).send(body);
        }
        res.send(body);
      })
      // .pipe(res);
  });

router.route('/username/:username?')
.get(function(req, res) {
  log('get /username', req.params);


  if (typeof req.params.username != 'undefined') {
    var query = {
      'username': req.params.username
    };
    proxy.request({
      url: '/parse/classes/_User?where=' + JSON.stringify(query),
      method: 'get'
    }, function(err, data) {
      if (err || data.statusCode != 200) return res.status(400).json(err);
      if (data && data.hasOwnProperty('body')) {
        if (data.body.hasOwnProperty('results')
          && data.body.results instanceof Array) {
            var available = !data.body.results.length;
            return res.status(available ? 200 : 409)
                      .json({message: (available ? 'Available' : 'Unavailable')});
        } else {
          return res.status(400).json({
            message: 'We were not able to determine the availability of the username provided.'
          });
        }
      }
    });
  } else {
    res.status(404).json({
      message: 'Missing required path parameter(s) please verify and try again.'
    });
  }
});

router.route('/roles/:role?')
.get(function(req, res) {
  log('get roles:', req.params);
  if (typeof req.params.role != 'undefined') {
    var query = {
      'name': req.params.role
    };
    proxy.request({
      url: '/parse/classes/_Role?where=' + JSON.stringify(query),
      method: 'get'
    }, function(err, data) {
      if (err || data.statusCode != 200) return res.status(400).json(err);
      if (data && data.hasOwnProperty('body')) {
        if (data.body.hasOwnProperty('results')
          && data.body.results instanceof Array) {
            return res.json(data.body.results);
        } else {
          return res.status(400).json({
            message: 'We were not able to determine the availability of the username provided.'
          });
        }
      }
    });
  } else {
    res.status(404).json({
      message: 'Missing required path parameter(s) please verify and try again.'
    });
  }
});

router.route('/manage-role/:className/:fromId/:linkType/:toId')
.put(function(req, res) {
  var url = '/parse/users/' + req.params.fromId;
  var type = (req.params.linkType == 'link' ? 'AddRelation' : 'RemoveRelation');
  var query = {};
  query['role'] = {
    // "__op": type,
    // "objects": [
      // {
        "__type": "Pointer",
        "className": req.params.className,
        "objectId": req.params.toId
      // }
    // ]
  };
  query._headers = {
    'X-Parse-Master-Key': config.parse.masterKey
  };
  console.log(JSON.stringify(query), url);
  proxy.request({
    url: url,
    method: 'put',
    body: query
  }, function(err, data) {
    if (err) return res.status(400).json(err);
    return res.status(data.statusCode).json(data.body);
  });
});

router.route('/manage-class/:toClass/:fromClass/:linkOf/:fromId/:linkType/:toId')
.put(function(req, res) {
  var url = '/parse/classes/' + req.params.toClass + '/' + req.params.toId;
  var type = (req.params.linkType == 'link' ? 'AddRelation' : 'RemoveRelation');
  var query = {};
  query[req.params.linkOf] = {
    // "__op": type,
    // "objects": [
    //   {
    "__type": "Pointer",
    "className": req.params.fromClass,
    "objectId": req.params.fromId
    //   }
    // ]
  },
  query._headers = {
    'X-Parse-Master-Key': config.parse.masterKey
  };
  console.log(JSON.stringify(query), url);
  proxy.request({
    url: url,
    method: 'put',
    body: query
  }, function(err, data) {
    if (err) return res.status(400).json(err);
    return res.status(data.statusCode).json(data.body);
  });
});

//beaconid: nwA47bGAHk
//propertyid: KWnYVAaEwQ