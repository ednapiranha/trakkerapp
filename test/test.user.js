'use strict';

var user = require('../lib/user');

var should = require('should');
var db = require('../lib/database');
var User = db.getUser();

var currUserId;

var req = {
  session: {
    email: 'test@test.com'
  },
  body: {
    username: 'test',
    location: ''
  },
  params: {
  }
};

describe('user', function () {
  before(function () {
    User.all()
      .success(function (users) {
        users.forEach(function (u) {
          u.destroy();
        });
      }).error(function (err) {
        throw new Error(err);
      });
    console.log('cleared test database');
  });

  describe('api', function () {
    it('adds a user', function (done) {
      user.saveProfile(req, function (err, u) {
        currUserId = u.id;
        u.email.should.equal(req.session.email);
        u.username.should.equal(req.body.username);
        done();
      });
    });

    it('loads a user', function (done) {
      user.loadProfile(req, function (err, u) {
        should.exist(u);
        u.email.should.equal(req.session.email);
        u.username.should.equal(req.body.username);
        done();
      });
    });

    it('gets a user', function (done) {
      user.get(currUserId, function (err, u) {
        should.exist(u);
        u.email.should.equal(req.session.email);
        u.username.should.equal(req.body.username);
        done();
      });
    });

    it('does not load a user', function (done) {
      req.session.email = 'doesnot@exist.com';
      user.loadProfile(req, function (err, u) {
        should.exist(err);
        err.toString().should.equal('Error: User not found');
        done();
      });
    });

    it('does not get a user', function (done) {
      user.get(-1, function (err, u) {
        should.exist(err);
        err.toString().should.equal('Error: User not found');
        done();
      });
    });
  });
});
