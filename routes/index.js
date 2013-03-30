'use strict';

module.exports = function(app, isLoggedIn) {
  var tracklist = require('../lib/tracklist');
  var user = require('../lib/user');
  var track = require('../lib/track');

  app.get('/', function (req, res) {
    res.render('index.html');
  });

  app.get('/me', isLoggedIn, function (req, res) {
    user.loadProfile(req, function (err, u) {
      if (u) {
        req.session.userId = u.id;

        if (u.username) {
          res.json({
            hasUsername: true,
            username: u.username,
            location: u.location
          });
        } else {
          res.json({
            hasUsername: false,
            username: null,
            location: u.location
          });
        }
      } else {
        res.status(404);
        res.json({ 'message': 'User not found' });
      }
    });
  });

  app.get('/tracklists/mine', isLoggedIn, function (req, res) {
    tracklist.getMine(req, function (err, tracklists) {
      if (err) {
        res.status(404);
        res.json({ 'message': 'Not found' });
      } else {
        res.json({
          'template': 'tracklists.html',
          'data': tracklists
        });
      }
    })
  });

  app.post('/tracklists', isLoggedIn, function (req, res) {
    tracklist.add(req, function (err, data) {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
      } else {
        res.json({
          'template': 'tracklist.html',
          'data': {
            'title': data.title,
            'artist': data.artist,
            'tracks': data.tracks
          }
        });
      }
    })
  });

  app.get('/tracklists/:id', function (req, res) {
    tracklist.get(req, function (err, tl) {
      if (err) {
        res.status(404);
        res.json({ 'message': err });
      } else {
        if (req.xhr) {
          tl.getTracks({ order: 'pos' }).success(function (tr) {
            res.json({
              'template': 'tracklist.html',
              'data': {
                'title': tl.title,
                'artist': tl.artist,
                'tracks': tr
              }
            });
          }).error(function (err) {
            res.status(400);
            res.json({ 'message': err });
          });
        } else {
          res.render('index.html');
        }
      }
    });
  });

  app.put('/tracks/:id', isLoggedIn, function (req, res) {
    track.update(req, function (err, track) {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
      } else {
        res.json({
          'track': track
        });
      }
    })
  });
};
