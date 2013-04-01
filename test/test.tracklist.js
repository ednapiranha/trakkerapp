'use strict';

var user = require('../lib/user');
var tracklist = require('../lib/tracklist');

var should = require('should');
var db = require('../lib/database');
var Tracklist  = db.getTracklist();
var User = db.getUser();

var currTracklist;
var currUserId;

var req = {
  session: {
    email: 'test2@test.com'
  },
  body: {
    username: 'test2',
    location: ''
  },
  params: {
  }
};

describe('tracklist', function () {
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
    it('adds a tracklist', function (done) {
      req.body.title = 'test title';
      req.body.artist = 'test artist';
      req.body.tracks = '00:00 some track';

      user.saveProfile(req, function (err, u) {
        req.session.userId = currUserId = u.id;
        req.session.username = u.username;

        tracklist.add(req, function (err, t) {
          currTracklist = t;
          t.title.should.equal(req.body.title);
          t.artist.should.equal(req.body.artist);
          done();
        });
      });
    });

    it('updates a tracklist', function (done) {
      req.body.title = 'new title';
      req.params.id = currTracklist.id;

      tracklist.update(req, function (err, t) {
        t.title.should.equal(req.body.title);
        done();
      });
    });

    it('does not update a tracklist', function (done) {
      req.body.title = 'new tracklist title invalid';
      req.params.id = currTracklist.id;
      req.session.userId = 0;

      tracklist.update(req, function (err, t) {
        should.exist(err);
        err.toString().should.equal('Error: User has no permission to update tracklist');
        done();
      });
    });

    it('does not delete a tracklist', function (done) {
      req.params.id = currTracklist.id;

      tracklist.delete(req, function (err, t) {
        should.exist(err);
        err.toString().should.equal('Error: User has no permission to delete tracklist');
        done();
      });
    });

    it('deletes a tracklist', function (done) {
      req.params.id = currTracklist.id;
      req.session.userId = currUserId;

      tracklist.delete(req, function (err, t) {
        should.exist(t);
        done();
      });
    });
  });
});
