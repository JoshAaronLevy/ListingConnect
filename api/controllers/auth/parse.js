var passport = require('passport');
var ParseStrategy = require('passport-parse');
var parse = require('../parse');
var _ = require('lodash');
var log = require('debug')('lc:controllers:auth');
var parseStrategy = new ParseStrategy({parseClient: parse});

passport.use(parseStrategy);

exports.login = function(req,res) {
  
  passport.authenticate('parse', function(err, user, info) {
    if (err || !user) {
      return res.status(400).json({payload : {error: info}, message : info.message});
    }
    log('PRE req.logIn', req.session, 'user', user)
    req.logIn(user, function(err) {
      if (err) return res.status(400).json({payload : {error: err}});
      log('SESSION.login', req.session)
      return res.json({
        payload : req.user,
        message : 'Authentication successful'
      });
    });
  })(req,res);
};

exports.signUp = function(req,res) {
  log('\nSIGNUP req.body', req.body, '\nreq.user: ', req.user, '\nreq.session: ', req.session, '\nreq.sessionId: ', req.sessionId, '\n');
  if (Object.keys(req.body).length > 1) {
    var attrs = _.omit(req.body,'username','password');
    parse.User.signUp(
      req.body.username,
      req.body.password,
      attrs,
      {
        success: function(user) {
          req.logIn(user, function(err) {
            if (err) return res.status(500).json({payload : {error: err}});
            return res.json({
              payload : req.user,
              message : 'User created successfully'
            });
          });
        },
        error: function(user, err) {
          return res.status(400).json({payload : {error: err}});
        }
      }
    );
  } else {
    return res.status(400).json({message: 'Missing required signup parameters, please try again.'});
  }
};

exports.logout = function(req, res) {
  req.logout();
  return res.json({message: 'You\'ve been logged out'});
};
