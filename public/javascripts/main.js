define(['jquery', 'local_settings', 'tracklist', 'track', 'user', 'utils', 'nunjucks', 'templates'],
  function ($, localSettings, tracklist, track, user, utils, nunjucks) {
  'use strict';

  var DEBUG = localSettings.DEBUG;

  if (DEBUG || !nunjucks.env) {
    // If not precompiled, create an environment with an HTTP loader
    nunjucks.env = new nunjucks.Environment(new nunjucks.HttpLoader('/templates'));
  }

  var body = $('body');

  var currentUser = localStorage.getItem('personaEmail');

  if (body.find('.actions a.authenticate').attr('data-action') === 'logout') {
    body.find('header .actions a.profile').removeClass('hidden');
  }

  navigator.id.watch({
    loggedInUser: currentUser,
    onlogin: function (assertion) {
      $.ajax({
        type: 'POST',
        url: '/persona/verify',
        data: { assertion: assertion },
        success: function (res, status, xhr) {
          localStorage.setItem('personaEmail', res.email);
          body.find('header .actions a.profile, header .link').removeClass('hidden');
          body.find('header .actions a.authenticate').data('action', 'logout')
                                                     .text('Sign out');
          user.get();
        },
        error: function(res, status, xhr) {
          self.status
            .addClass('error')
            .text('There was an error logging in')
            .addClass('on');

          settings.statusTimer(self.status);
        }
      });
    },
    onlogout: function() {
      $.ajax({
        url: '/persona/logout',
        type: 'POST',
        success: function(res, status, xhr) {
          $.get('/logout', function () {
            localStorage.removeItem('personaEmail');
            body.find('header .actions a.profile, header .link').addClass('hidden');
            body.find('header .actions a').data('action', 'login')
                                          .text('Sign in');
            user.get();
          });
        },
        error: function(res, status, xhr) {
          console.log('logout failure ', res);
        }
      });
    }
  });

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
        tracklist.del(self);
        break;

      case 'track-delete':
        ev.preventDefault();
        track.del(self);
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

      case 'search':
        ev.preventDefault();
        track.search(self);
        break;
    }
  });
});
