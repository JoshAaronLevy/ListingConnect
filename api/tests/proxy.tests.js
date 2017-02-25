var config = require('../config');
var supertest = require('supertest');
var helpers = require('./helpers');
var request = supertest('http://' + config.hostname + ':' + config.port);
// var agent = supertest.agent(app);

describe('interacting with the proxy', function() {
  it('can create a property', function(done) {
    request
      .post('/parse/classes/Properties')
      .set('Content-Type', 'application/json')
      .send({
        _headers: {'X-Parse-Session-Token': helpers.getToken()},
        address1: '123 Main St.',
        city: 'Shitville'})
      .expect(function(res) {
        if (!res.body.hasOwnProperty('updatedAt')) return 'This should return with a proper updated time.';
      })
      .expect(200)
      .end(function _dunzo(err, res) {
        console.log('PROPERTIES', res.body);
        if (!res.body.objectId && !(res.body.payload && res.body.payload.objectId)) {
          return done(new Error('Unable to locate objectId'));
        } else {
          return done();
        }

      });
  });

  it('can get login profile', function(done) {
    request
      .get('/parse/sessions/me')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(200)
      .end(function _dunzo(err, res) {
        console.log('LOGIN PROFILE', res.body);
        if (!res.body.objectId && !(res.body.payload && res.body.payload.objectId)) {
          return done(new Error('Unable to locate objectId'));
        } else return done();

      });
  });

  it('can process queries', function(done) {
    request
      .get('/parse/classes/_User?where={"username":"test"}')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (!res.body.results.length) {
          return 'We should have a result here';
        }
      })
      .expect(200, done);
  });
  it('can lookup test user by objectId', function(done) {
    request
      .get('/parse/classes/_User/fiYAL1Wfbe')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (!res.body.username) {
          return 'We should have a result here';
        }
      })
      .expect(200, done);
  });
  it('tests an empty path', function(done) {
    request
      .get('/parse/username/')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (res.body.message != 'Missing required path parameter(s) please verify and try again.') {
          return 'This shouldnt work.';
        }
      })
      .expect(404, done);
  });
  it('tests an unavailable username', function(done) {
    request
      .get('/parse/username/test')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (res.body.message != 'Unavailable') {
          return 'This username should be unavailable';
        }
      })
      .expect(409,done);
  });
  it('tests an available username', function(done) {
    request
      .get('/parse/username/sharkzebrasgiraffeonaplane')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (res.body.message != 'Available') {
          return 'This username should be available';
        }
      })
      .expect(200,done);
  });
  it('relates a user to a role', function(done) {
    request
      .put('/parse/manage-role/_User/fiYAL1Wfbe/link/CXOw1h0WNK')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (!res.body.hasOwnProperty('updatedAt')) return 'This should return with a proper updated time.';
      })
      .expect(200,done);
  });
  it('relates a user to a role', function(done) {
    request
      .put('/parse/manage-role/_User/fiYAL1Wfbe/unlink/CXOw1h0WNK')
      .set('Content-Type', 'application/json')
      .set('X-Parse-Session-Token', helpers.getToken())
      .expect(function(res) {
        if (!res.body.hasOwnProperty('updatedAt')) return 'This should return with a proper updated time.';
      })
      .expect(200,done);
  });

});
