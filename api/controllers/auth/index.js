var express = require('express');
var router = module.exports = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var parse = require('./parse');
var facebook = require('./facebook');

passport.serializeUser(function(user, done) {
  done(null, {token: user._sessionToken, id: user.id});
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


router.route('/logout')
  .get(parse.logout);

router.route('/signup')
  .post(parse.signUp);

router.route('/facebook')
  .get(facebook.oauth);

router.route('/*')
  .get(parse.login)
  .post(parse.login);
  