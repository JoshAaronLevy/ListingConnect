var config = require('../../config');
var graph = require('fbgraph');
var parse = require('../parse');
var _ = require('lodash');
var proxy = require('../proxy').parse;

module.exports.oauth = function(req,res) {
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
      'client_id': config.facebook.appId,
      'redirect_uri': config.facebook.redirectUri,
      'scope': 'email, user_about_me, user_birthday, user_location'
    });
    if (!req.query.error) {
      return res.redirect(authUrl);
    } else {
      return res.status(400).json({message: 'Access Denied'});
    }
  }
  graph.authorize({
    'client_id': config.facebook.appId,
    'client_secret': config.facebook.secret,
    'redirect_uri': config.facebook.redirectUri,
    'code': req.query.code
  }, function(err, fb) {
    if (err) {
      return res.status(400).json(err);
    } else {
      graph.setAccessToken(fb.access_token);
      graph.get('me', function(err, me) {
        if (err || !me) return res.status(400).json(err);
        var linkAccount = {
          authData: {
            facebook: {
              id: me.id,
              access_token: fb.access_token,
              expiration_date: new Date(Date.now() + (~~fb.expires)).toISOString()
            }
          },
          _headers: {
            'X-Parse-Master-Key': config.parse.masterKey
          }
        };
        proxy.request({
          url: '/parse/users' + (req.user ? '/' + req.user.id : ''),
          method: (req.user ? 'put' : 'post'),
          body: linkAccount
        }, function(err, data) {
          if (err || data.statusCode != 200) return res.status(400).json(err);
          if (!req.user) {
            req.logIn(data.body, function(err) {
              if (err) return res.status(400).json(err);
              req.session.passport.user.token = data.body.sessionToken;
              req.session.passport.user.id = data.body.objectId;
              return res.status(data.statusCode).json(_.extend({message: 'You have been logged in.'}, data.body));
            });
          } else {
            return res.status(data.statusCode).json(_.extend({message: 'You have been logged in.'}, data.body));
          }
        });
      });
    }
  });
};
