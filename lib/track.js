'use strict';

var sanitizer = require('sanitizer');

var db = require('./database');

var Tracklist = db.getTracklist();
var Track = db.getTrack();

var tracklist = require('./tracklist');

exports.get = function (req, callback) {
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
    }).error(function (err) {
      callback(err);
    });
};

exports.update = function (req, callback) {
  var id = parseInt(req.params.id, 10);

  Track.find({
    where: {
      'id': id
    }}).success(function (track) {
      track.getTracklist().success(function (tracklist) {
        if (tracklist.user_id !== parseInt(req.session.userId, 10)) {
          callback(new Error('User has no permission to update this track'));
        } else {
          track.title = req.body.title;
          track.startTime = req.body.startTime;
          track.keywords = req.body.keywords;

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
        }
      }).error(function (err) {
        callback(err);
      });
    }).error(function (err) {
      callback(err);
    });
};

exports.add = function (req, pos, tr, callback) {
  req.params.id = req.body.tracklist_id;

  tracklist.get(req, function (err, tl) {
    if (err) {
      callback(err);
    } else {
      if (tl.user_id !== parseInt(req.session.userId, 10)) {
        callback(new Error('User has no permission to add this track'));
      } else {
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
              callback(null, track);
            }).error(function (err) {
              console.log('could not add track ', track.title);
              callback(err);
            });
        }
      }
    }
  });
};

exports.search = function (req, callback) {
  var keyword = sanitizer.escape(req.body.keyword.trim());

  Track.findAll({
    where: ['title LIKE ?', '%' + keyword + '%']
  }).success(function (tracks) {
    callback(null, {
      keyword: keyword,
      tracks: tracks
    });
  }).error(function (err) {
    callback(err);
  });
}

exports.delete = function (req, callback) {
  var id = parseInt(req.params.id, 10);

  Track.find({
    where: {
      id: id
    }}).success(function (track) {
      track.getTracklist().success(function (tl) {
        if (tl.user_id !== parseInt(req.session.userId, 10)) {
          callback(new Error('User has no permission to delete this track'));
        } else {
          track.destroy();
          callback(null, 'deleted');
        }
      }).error(function (err) {
        callback(err);
      });
    }).error(function (err) {
      callback(err);
    });
};
