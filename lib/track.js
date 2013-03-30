'use strict';

var db = require('./database');

var Tracklist = db.getTracklist();
var Track = db.getTrack();

exports.get = function(req, callback) {
  var id = parseInt(req.params.id, 10);

  Track.find({
    where: {
      id: id
    }}).success(function (track) {
      if (!track) {
        callback(new Error('Invalid track'));
      } else {
        callback(null, track);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.update = function(req, callback) {
  var id = parseInt(req.params.id, 10);

  Track.find({
    where: {
      'id': id
    }}).success(function (track) {
      track = {
        id: parseInt(tracklist.id, 10),
        title: req.body.title.trim(),
        artist: req.body.artist.trim(),
        tracklist_id: parseInt(track.tracklist_id, 10),
        keywords: req.body.keywords.trim(),
        pos: parseInt(req.body.pos.trim(), 10)
      };

      var errors = track.validate();

      if (errors) {
        callback(errors.title);
      } else {
        track.save()
          .success(function() {
             callback(null, track);
          }).error(function(err) {
            callback(err);
          });
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.add = function(req, pos, tr) {
  var track = Track.build({
    title: tr.title,
    tracklist_id: parseInt(req.body.tracklist_id, 10),
    startTime: tr.startTime,
    pos: pos
  });

  var errors = track.validate();

  if (errors) {
    callback(errors.title[0]);
  } else {
    track.save()
      .success(function () {
        console.log('added track ', track.title);
      }).error(function(err) {
        throw new Error('could not add track ', track.title);
      });
  }
};

exports.delete = function(req) {
  var id = parseInt(req.body.id, 10);

  Track.find({
    where: {
      id: id
    }}).success(function (track) {
      track.id = parseInt(track.id, 10);
      track.destroy();
    }).error(function(err) {
      throw new Error('Could not find track ', err);
    });
};
