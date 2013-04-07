define(['jquery', 'authenticate', 'local_settings', 'tracklist', 'track', 'user', 'utils', 'nunjucks', 'templates'],
  function ($, authenticate, localSettings, tracklist, track, user, utils, nunjucks) {
  'use strict';

  var DEBUG = localSettings.DEBUG;

  if (DEBUG || !nunjucks.env) {
    // If not precompiled, create an environment with an HTTP loader
    nunjucks.env = new nunjucks.Environment(new nunjucks.HttpLoader('/templates'));
  }

  var body = $('body');

  user.get();

  body.on('click', function (ev) {
    var self = $(ev.target);

    switch (self.data('action')) {
      case 'login':
        ev.preventDefault();
        navigator.id.request();
        break;

      case 'logout':
        ev.preventDefault();
        navigator.id.logout();
        break;

      case 'tracklist-delete':
        ev.preventDefault();
        tracklist.delete(self);
        break;

      case 'track-delete':
        ev.preventDefault();
        track.delete(self);
        break;
    }
  });

  body.on('submit', function (ev) {
    var self = $(ev.target);

    switch (self.data('action')) {
      case 'tracklist-add':
        ev.preventDefault();
        tracklist.add(self);
        break;

      case 'track-edit':
        ev.preventDefault();
        track.update(self);
        break;

      case 'profile-edit':
        ev.preventDefault();
        user.update(self);
        break;

      case 'tracklist-edit':
        ev.preventDefault();
        tracklist.update(self);
        break;
    }
  });
});
