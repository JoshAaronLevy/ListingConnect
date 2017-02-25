var request = require('request'),
    _ = require('lodash'),
    bodyParser = require('body-parser');
var log = require('debug')('lc:proxy:lib');

var Proxy = function(opts, app) {
  log('Proxy Adapter Starting:', opts)
  if (typeof opts == 'undefined') throw new Error('You must provide a reference to an `options` object');

  this.endpoint = '/proxy';
  this.host = null;
  this.preware = [];
  this.headers = {};
  this.timeout = null;

  // [request](http://bit.ly/1U1FE2t) has a
  // lot of opts; and I dont fully intend on
  // adding them all here, so if it doesn't
  // exist as an option here, you pass in an
  // object with the values you want to set.
  this._requestOptions = null;

  if (opts) _.extend(this, opts);

  if (!this.preware instanceof Array) {
    this.preware = [this.preware];
  }

  var buildUri = function(url) {
    var uri;
    log('buildUri', uri);
    if (typeof url != 'undefined' && this.host) {
      uri = url.replace(this.endpoint,'');
      if (!uri || uri == '/') return null;
      return this.host + uri;
    }
    return null;
  }.bind(this);

  var setProxyObjOnRequest = function(req, res, next) {
    log('setProxyObjOnRequest', this);
    req._proxyObject = _.omit(this,'preware');
    return next();
  }.bind(this);

  this.request = function(req, fn) {
    // required for request to work...
    // {
    //    url: '',
    //    body: '',
    //    method: ''
    // }
    var opts = {};
    if (this._requestOptions) _.merge(opts, this._requestOptions);
    log('requested: url=%s', req.url);
    opts.url = buildUri(req.url);
    log('requested: opts.url=%s', opts.url);
    opts.headers = this.headers;
    opts.method = req.method;
    opts.json = true;
    if (this.timeout) {
      opts.timeout = this.timeout;
    }

    // i guess the second you start being tricky
    // is the same second you want to start docs
    // we're going to inspect the method type,
    // and then to be on the safe side we'll also
    // enforce your req.body has some stuff in it
    if (opts.method.toLowerCase() != 'get'
      && Object.keys(req.body).length) {
      if (req.body._headers) {
        _.extend(opts.headers,req.body._headers);
        delete req.body._headers;
      }
      opts.body = req.body;
    }
    if (opts.url) return request(opts, fn);
    return fn({
      message: 'You cannot proxy an empty path, please supply a url to request.',
      code: 'EMTPYPROXYURL'
    },null);
  }.bind(this);

  this.middleware = function(req,res,next) {
    log('middleware called url=%s', req.url)
    return this.request(req, next);
  }.bind(this);

  var router = function(req, res) {
    log('router', req.url);
    this.request(req, function(err, data) {
      if (data && data.statusCode == 404) return res.status(404).json({
        message: 'The request URI was not found, verify and try again.'
      });
      if (err) {
        var error = {
          message: 'Oh no, we\'ve had a critical error -- we have notified our team of the error.',
          status: 500
        };
        if (err.code == 'ETIMEDOUT') {
          error = {
            message: 'Oops. The host was taking too long to respond, connection timed out.',
            status: 408
          }
        } else if (err.code == 'EMTPYPROXYURL') {
          error = {
            message: err.message,
            status: 400
          }
        }
        return res.status(error.status).json({message: error.message});
      } else {
        return res.status(data.statusCode).send(data.body);
      }
    });
  }.bind(this);

  if (app) {
    app.use(setProxyObjOnRequest, this.preware, router);
  }


  return this;

};

module.exports = Proxy;
