'use strict';

var gravatar = require('gravatar');
var db = require('./database');
var User = db.getUser();

var USERNAME_MATCH = /[^A-Z0-9_]/gi;

exports.getUser = function(req, callback) {
  User.find(parseInt(req.params.id, 10))
    .success(function(u) {
      callback(null, u);
    }).error(function(err) {
      callback(err);
    });
};

exports.loadProfile = function(req, callback) {
  User.find({
    where: {
      email: req.session.email
    }}).success(function(user) {
      if (!user) {
        callback(new Error('user not found'));
      } else {
        user.gravatar = gravatar.url(user.email);
        callback(null, user);
      }
    }).error(function(err) {
      callback(err);
    });
};

exports.saveProfile = function(req, callback) {
  var username = req.body.username.replace(USERNAME_MATCH, '').trim();

  User.find({
    where: {
      email: req.session.email
    }}).success(function (user) {
      if (user) {
        user.id = parseInt(user.id, 10);
        user.username = username;
        user.location = req.body.location;

        var errors = user.validate();

        if (errors) {
          callback(errors.username);
        } else {
          user.save()
            .success(function() {
              callback(null, user);
            }).error(function(err) {
              callback(err);
            });
        }
      } else {
        var newUser = User.build({
          'username': username,
          'email': req.session.email,
          'location': req.body.location
        });

        newUser.save()
          .success(function() {
            callback(null, newUser);
          }).error(function(err) {
            callback(err);
          });
      }
    }).error(function (err) {
      callback(err);
    });
};

exports.get = function(id, callback) {
  User.find(id)
    .success(function(user) {
      if (!user) {
        callback(new Error('User not found'));
      } else {
        callback(null, user);
      }
    }).error(function(err) {
      callback(err);
    });
};
