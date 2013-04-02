'use strict';

module.exports = function (app, isLoggedIn, hasProfile) {
  var tracklist = require('../lib/tracklist');
  var user = require('../lib/user');
  var track = require('../lib/track');

  app.get('/', function (req, res, next) {
    user.loadProfile(req, function (err, u) {
      var username = null;

      if (u) {
        req.session.userId = u.id;
        req.session.username = u.username;
      }

      if (req.xhr) {
        if (req.session.email) {
          res.render('index.html');
        } else {
          res.json({
            template: 'home.html'
          });
        }
      } else {
        res.render('index.html');
      }
    });
  });

  app.get('/me', isLoggedIn, function (req, res, next) {
    user.loadProfile(req, function (err, u) {
      if (err) {
        res.status(404);
        next();
      } else {
        req.session.userId = u.id;
        req.session.username = u.username;
        tracklist.getMine(req, function (err, tracklists) {
          if (err) {
            res.status(400);
            next(err);
          } else {
            res.json({
              template: 'dashboard.html',
              data: tracklists
            });
          }
        });
      }
    });
  });

  app.post('/me', isLoggedIn, function (req, res, next) {
    user.saveProfile(req, function (err, u) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        req.session.username = u.username;
        res.json({
          template: 'profile.html',
          user: u
        });
      }
    });
  });

  app.post('/tracklists', isLoggedIn, hasProfile, function (req, res, next) {
    tracklist.add(req, function (err, data) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          template: 'tracklist.html',
          data: {
            id: data.id,
            title: data.title,
            artist: data.artist,
            tracks: data.tracks
          }
        });
      }
    });
  });

  app.get('/tracklists/new', isLoggedIn, hasProfile, function (req, res, next) {
    if (req.xhr) {
      res.json({
        template: 'tracklist_new.html'
      });
    } else {
      res.render('index.html');
    }
  });

  var displayTracklists = function (action, template, req, res, next) {
    tracklist.get(req, function (err, tl) {
      if (err) {
        res.status(404);
        next();
      } else {
        var owner = (tl.user_id === parseInt(req.session.userId, 10));
        if (action === 'edit' && !req.session.email && !owner) {
          res.render('index.html');
        } else {
          if (req.xhr) {
            tl.getTracks({ order: 'pos' }).success(function (tr) {
              res.json({
                template: template,
                data: {
                  authenticated: !!req.session.email,
                  owner: owner,
                  id: tl.id,
                  title: tl.title,
                  artist: tl.artist,
                  tracks: tr
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
      }
    });
  };

  app.get('/tracklists/:id', function (req, res, next) {
    displayTracklists('get', 'tracklist.html', req, res, next);
  });

  app.get('/tracklists/:id/edit', isLoggedIn, hasProfile, function (req, res, next) {
    displayTracklists('edit', 'tracklist_edit.html', req, res, next);
  });

  app.delete('/tracklists/:id', function (req, res, next) {
    tracklist.delete(req, function (err, message) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          message: message
        });
      }
    });
  });

  app.put('/tracks/:id', isLoggedIn, hasProfile, function (req, res, next) {
    track.update(req, function (err, track) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          track: track
        });
      }
    });
  });

  app.delete('/tracks/:id', function (req, res, next) {
    track.delete(req, function (err, message) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          message: message
        });
      }
    });
  });
};
