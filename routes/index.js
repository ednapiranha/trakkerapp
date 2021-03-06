'use strict';

module.exports = function (app, isLoggedIn, hasProfile) {
  var tracklist = require('../lib/tracklist');
  var user = require('../lib/user');
  var track = require('../lib/track');

  app.get('/', function (req, res, next) {
    if (!req.session.username) {
      if (req.xhr) {
        res.json({
          template: 'home.html'
        });
      } else {
        res.render('index.html');
      }
    } else {
      user.loadProfile(req, function (err, u) {
        if (u) {
          req.session.userId = u.id;
          req.session.username = u.username;

          res.redirect('/dashboard');
        } else {
          res.redirect('/me');
        }
      });
    }
  });

  app.get('/logout', function (req, res) {
    req.session.reset();
    if (req.xhr) {
      res.json({ message: 'logged out' });
    } else {
      res.redirect('/');
    }
  });

  app.get('/global', function (req, res) {
    tracklist.global(function (err, tracklists) {
      if (req.xhr) {
        res.json({
          template: 'global.html',
          data: tracklists
        });
      } else {
        res.render('index.html');
      }
    });
  });

  app.get('/dashboard', isLoggedIn, hasProfile, function (req, res, next) {
    tracklist.getMine(req, function (err, tracklists) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        if (req.xhr) {
          res.json({
            template: 'dashboard.html',
            data: tracklists
          });
        } else {
          res.render('index.html');
        }
      }
    });
  });

  app.get('/me', isLoggedIn, function (req, res, next) {
    user.loadProfile(req, function (err, u) {
      if (err) {
        if (req.xhr) {
          res.json({
            template: 'profile.html',
            tracklistTotal: 0,
            user: {
              email: req.session.email,
              username: null,
              location: null
            }
          });
        } else {
          res.status(404);
          next(err);
        }
      } else {
        req.session.userId = u.id;
        req.session.username = u.username;
        if (req.xhr) {
          var tracklistCount = 0;

          u.getTracklists().success(function (tracklists) {
            if (tracklists) {
              tracklistCount = tracklists.length;
            }
            res.json({
              template: 'profile.html',
              tracklistTotal: tracklistCount,
              user: u
            });
          }).error(function (err) {
            res.status(400);
            next(err);
          });
        } else {
          res.render('index.html');
        }
      }
    });
  });

  app.post('/me', isLoggedIn, function (req, res, next) {
    user.saveProfile(req, function (err, u) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        req.session.userId = u.id;
        req.session.username = u.username;
        res.json({
          template: 'profile.html',
          user: u
        });
      }
    });
  });

  app.post('/search', function (req, res, next) {
    track.search(req, function (err, data) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          template: 'search.html',
          data: {
            keyword: data.keyword,
            tracks: data.tracks
          }
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
            authenticated: true,
            owner: true,
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

  var dateFormat = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    if (isNaN(parseInt(year, 10))) {
      return '';
    }

    if (parseInt(month, 10) < 10) {
      month = '0' + month;
    }

    var day = date.getDate() + 1;

    if (parseInt(day, 10) < 10) {
      day = '0' + day;
    }

    return year + '-' + month + '-' + day;
  };

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
                  released: dateFormat(tl.released),
                  download: tl.download,
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

  app.put('/tracklists/:id', isLoggedIn, hasProfile, function (req, res, next) {
    tracklist.update(req, function (err, tl) {
      if (err) {
        res.status(400);
        next(err);
      } else {
        res.json({
          tracklist: tl
        });
      }
    });
  });

  app.del('/tracklists/:id', function (req, res, next) {
    tracklist.del(req, function (err, message) {
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

  app.del('/tracks/:id', function (req, res, next) {
    track.del(req, function (err, message) {
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
