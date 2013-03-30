'use strict';

module.exports = function(app, isLoggedIn) {
  var tracklist = require('../lib/tracklist');
  var user = require('../lib/user');

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
          'tracklists': tracklists
        });
      }
    })
  });

  app.post('/tracklists', isLoggedIn, function(req, res) {
    tracklist.add(req, function (err, tracklist) {
      if (err) {
        res.status(400);
        res.json({ 'message': err });
      } else {
        res.json({
          'tracklists': tracklist
        });
      }
    })
  });
};
