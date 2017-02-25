var config = require('../config');
var request = require('supertest')('http://' + config.hostname + ':' + config.port);
var helpers = require('./helpers');
var _ = require('lodash');

describe('parse auth persistance proxy', function() {
  var r = Math.random().toString().substr(2, 8);
  var randomCredentials = {
    username: 'test_' + r,
    password: r,
    // role: helpers.getPointer('CRErOx3C02', '_Role')
  };
  var generatedUser = null;

  console.log('randomCredentials', randomCredentials);

  it('can create user - POST /auth/signup', function(done) {
    request
      .post('/auth/signup')
      .set('Content-Type', 'application/json')
      .send(_.extend({
        role: helpers.getPointer('CRErOx3C02', '_Role')
      }, randomCredentials))
      .expect(function(res) {
        console.log('SIGNUP RESPONSE:\n', res.body);
        if (res.body.message !== 'Authentication successful') {
          return 'Unable to determine if user is logged in';
        } else {
          generatedUser = res.body.payload;
          if (res.body.sessionToken) {
            helpers.saveToken(res.body.sessionToken);
          } else {
            throw new Error('No sessionToken found!!! ' + JSON.stringify(res.body));
          }
        }
      })
      .expect(200, done);
  });

  it('can user login - POST /auth', function(done) {
    // console.log('Logging in with :', randomCredentials);

    // randomCredentials.email = randomCredentials.username;
    request
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send(randomCredentials)
      .expect(200)
      .end(function _dunzo(err, res) {
        console.log('         Login RESPONSE:\n', res.body);
        if (res.body.message !== 'Authentication successful') {
          return done(new Error('Unable to determine if user is logged in'));
        } else {
          generatedUser = res.body.payload;
          if (res.body.sessionToken) {
            helpers.saveToken(res.body.sessionToken);
          // } else {
          //   throw new Error('No sessionToken found!!! ' + JSON.stringify(res.body));
          }
          return done();
        }

      });
  });

  it('should fail on duplicate signup', function(done) {
    request
      .post('/auth/signup')
      .set('Content-Type', 'application/json')
      .send(randomCredentials)
      .expect(function(res) {
        if (res.body.message !== 'Authentication successful') {
          return 'Unable to determine if user is logged in';
        }
      })
      .expect(400, done);
  });

  it('Missing signup creds', function(done) {
    request
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send({username: '', password: null})
      .expect(function(res) {
        if (res.body.message !== 'Authentication successful') {
          return 'Unable to determine if user is logged in';
        }
      })
      .expect(400, done);
  });
});
