'use strict';

var db = require('./database');
var Tracklist = db.getTracklist();
var Track = db.getTrack();
var User = db.getUser();

/*
var dateDisplay = function(time) {
  var date = new Date(parseInt(time, 10));
  var diff = (Date.now() - date) / 1000;
  var dayDiff = Math.floor(diff / 86400);

  if (isNaN(dayDiff)) {
    return '';
  }

  if (dayDiff <= 0) {
    if (diff < 60) {
      return 'less than 1 minute';
    } else if (diff < 3600) {
      var minDiff = Math.floor(diff / 60);
      if (minDiff === 1) {
        return minDiff + ' minute ago';
      } else {
        return minDiff + ' minutes ago';
      }
    } else {
      var hourDiff = Math.floor(diff / 3600);
      if (hourDiff === 1) {
        return Math.floor(diff / 3600) + ' hour ago';
      } else {
        return Math.floor(diff / 3600) + ' hours ago';
      }
    }
  } else {
    if (dayDiff === 1) {
      return dayDiff + ' day ago';
    } else {
      return dayDiff + ' days ago';
    }
  }
};

var getTracks = function(t, callback) {
  t.getTracks({
    order: 'pos ASC'
  }).success(function (tracks) {
    var trackCount = 0;
    t.tracks = [];
    t.trackCount = tracks.length;

    if (tracks.length > 0) {
      tracks.forEach(function (tk) {
        t.tracks.push(tk);

        if (++trackCount === tracks.length) {
          callback(null, t);
        }
      });
    } else {
      callback(null, t)
    }
  }).error(function (err) {
    callback(err);
  });
};
*/

exports.getMine = function(req, callback) {
  Tracklist.find({
    where: {
      user_id: req.session.userId
    }, include: ['Tracks'] }).success(function (tracklist) {
      if (!tracklist) {
        callback(new Error('Invalid tracklist'));
      } else {
        callback(null, tracklist);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.get = function(req, callback) {
  var id = parseInt(req.params.id, 10);

  Tracklist.find({
    where: {
      id: id
    }, include: ['Tracks'] }).success(function (tracklist) {
      if (!tracklist) {
        callback(new Error('Invalid tracklist'));
      } else {
        callback(null, tracklist);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.update = function(req, callback) {
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

exports.add = function(req, callback) {
  var tracklist = Tracklist.build({
    title: req.body.title.trim(),
    artist: req.body.artist.trim(),
    released: req.body.released.trim(),
    user_id: req.session.userId
  });

  var errors = tracklist.validate();

  if (errors) {
    callback(errors.title[0]);
  } else {
    tracklist.save()
      .success(function (t) {
        callback(null, t);
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
    }}).success(function(tracklist) {
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
