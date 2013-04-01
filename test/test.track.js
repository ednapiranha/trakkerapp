'use strict';

var track = require('../lib/track');
var user = require('../lib/user');
var tracklist = require('../lib/tracklist');

var should = require('should');
var db = require('../lib/database');
var Track = db.getTrack();
var Tracklist  = db.getTracklist();
var User = db.getUser();

var tracklistId;
var trackId;
var currTrack;
var currTracklist;

var req = {
  session: {
    userId: 1,
    username: 'test',
    email: 'test@test.com'
  },
  body: {
  },
  params: {
  }
};

describe('track', function () {
  after(function () {
    User.all()
      .success(function (users) {
        users.forEach(function (u) {
          u.destroy();
        });
      }).error(function (err) {
        throw new Error(err);
      });
    Track.all()
      .success(function (tracks) {
        tracks.forEach(function (t) {
          t.destroy();
        });
      }).error(function (err) {
        throw new Error(err);
      });
    Tracklist.all()
      .success(function (tracklists) {
        tracklists.forEach(function (t) {
          t.destroy();
        });
      }).error(function (err) {
        throw new Error(err);
      });
    console.log('cleared test database');
  });

  it('adds a track', function (done) {
    req.body.title = 'test title';
    req.body.artist = 'test artist';
    req.body.tracks = '00:00 some track';

    tracklist.add(req, function (err, t) {
      currTracklist = t;
      req.body.title = 'title track';
      req.body.tracklist_id = t.id;

      t.tracks.forEach(function (tr) {
        currTrack = tr;
        tr.title.should.equal('some track');
        tr.startTime.should.equal('00:00');
        done();
      });
    });
  });

  it('updates a track', function (done) {
    req.body.title = 'new title';
    req.params.id = currTrack.id;

    track.update(req, function (err, tr) {
      tr.title.should.equal('new title');
      done();
    });
  });

  it('does not update a track', function (done) {
    req.body.title = '';
    req.params.id = currTrack.id;

    track.update(req, function (err, tr) {
      console.log(tr);
      done();
    });
  });

  it('does not add a track', function (done) {
    req.session.userId = 2;
    req.body.tracklist_id = currTracklist.id;

    track.add(req, 1, '00:00 some track invalid', function (err, t) {
      should.exist(err);
      err.toString().should.equal('Error: User has no permission to add this track');
      done();
    });
  });

  it('does not update a track', function (done) {
    req.body.title = 'new track title invalid';
    req.params.id = currTrack.id;

    track.update(req, function (err, t) {
      should.exist(err);
      err.toString().should.equal('Error: User has no permission to update this track');
      done();
    });
  });

  it('does not delete a track', function (done) {
    req.params.id = currTrack.id;

    track.delete(req, function (err, t) {
      should.exist(err);
      err.toString().should.equal('Error: User has no permission to delete this track');
      done();
    });
  });

  it('deletes a track', function (done) {
    req.params.id = currTrack.id;
    req.session.userId = 1;

    track.delete(req, function (err, t) {
      should.exist(t);
      done();
    });
  });
});
