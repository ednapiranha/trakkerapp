'use strict';

var trakker = require('trakker');

var db = require('./database');
var track = require('./track');

var Tracklist = db.getTracklist();
var Track = db.getTrack();
var User = db.getUser();

exports.getMine = function (req, callback) {
  Tracklist.findAll({
    where: {
      user_id: req.session.userId
    }}).success(function (tracklists) {
      if (!tracklists) {
        callback(null, []);
      } else {
        callback(null, tracklists);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.get = function (req, callback) {
  var id = parseInt(req.params.id, 10);

  Tracklist.find({
    where: {
      id: id
    }}).success(function (tracklist) {
      if (!tracklist) {
        callback(new Error('Invalid tracklist'));
      } else {
        callback(null, tracklist);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.update = function (req, callback) {
  var id = parseInt(req.params.id, 10);

  Tracklist.find({
    where: {
      'id': id,
      'user_id': req.session.userId
    }}).success(function (tracklist) {
      if (!tracklist) {
        callback(new Error('User has no permission to update tracklist'));
      } else {
        tracklist = {
          id: parseInt(tracklist.id, 10),
          title: req.body.title.trim(),
          artist: req.body.artist.trim(),
          released: req.body.released.trim()
        };

        var errors = tracklist.validate();

        if (errors) {
          callback(errors.title);
        } else {
          tracklist.save()
            .success(function() {
               callback(null, tracklist);
            }).error(function(err) {
              callback(err);
            });
        }
      }
    }).error(function(err) {
      callback(err);
    });
};

var addTracks = function (req, tlist, tracks, callback) {
  var tracksArr = [];
  var count = 0;

  tracks.forEach(function (tr) {
    track.add(req, ++ count, tr, function (err, tk) {
      if (err) {
        callback(err);
      } else {
        tracksArr.push(tk);

        if (tracksArr.length === tracks.length) {
          tracksArr = tracksArr.sort(function (a, b) {
            return parseInt(a.pos, 10) - parseInt(b.pos, 10)
          });

          var data = {
            id: tlist.id,
            title: tlist.title,
            artist: tlist.artist,
            tracks: tracksArr
          };

          callback(null, data);
        }
      }
    });
  });
};

exports.add = function (req, callback) {
  var tracklist = Tracklist.build({
    title: req.body.title.trim(),
    artist: req.body.artist.trim(),
    released: req.body.released,
    user_id: req.session.userId
  });

  var errors = tracklist.validate();

  if (errors) {
    callback(errors.title[0]);
  } else {
    tracklist.save()
      .success(function (t) {
        req.body.tracklist_id = t.id;
        var tracks = trakker.generate(req.body.tracks);

        addTracks(req, t, tracks, callback);
      }).error(function(err) {
        callback(err);
      });
  }
};

exports.delete = function(req) {
  var id = parseInt(req.body.id, 10);

  Tracklist.find({
    where: {
      id: id,
      user_id: req.session.userId
    }}).success(function (tracklist) {
      if (!tracklist) {
        throw new Error('User has no permission to delete tracklist ', id);
      } else {
        tracklist.id = parseInt(tracklist.id, 10);
        tracklist.destroy();
      }
    }).error(function(err) {
      throw new Error('Could not find tracklist ', err);
    });
};
