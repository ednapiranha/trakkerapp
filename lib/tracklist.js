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
    }, limit: 100, order: 'id DESC' }).success(function (tracklists) {
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
        tracklist.title = req.body.title;
        tracklist.artist = req.body.artist;
        tracklist.released = req.body.released;

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
            return parseInt(a.pos, 10) - parseInt(b.pos, 10);
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

exports.global = function (callback) {
  Tracklist.findAll({
    limit: 100, order: 'id DESC' }).success(function (tracklists) {
      if (!tracklists) {
        callback(null, []);
      } else {
        callback(null, tracklists);
      }
    }).error(function(err) {
      callback(err);
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

exports.delete = function(req, callback) {
  var id = parseInt(req.params.id, 10);

  Tracklist.find({
    where: {
      id: id,
      user_id: req.session.userId
    }}).success(function (tracklist) {
      if (!tracklist) {
        callback(new Error('User has no permission to delete tracklist'));
      } else {
        tracklist.destroy();
        callback(null, 'deleted');
      }
    }).error(function(err) {
      callback(err);
    });
};
