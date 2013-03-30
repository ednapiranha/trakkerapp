define(['jquery', 'authenticate', 'local_settings', 'tracklist', 'track', 'nunjucks', 'templates'],
  function ($, authenticate, localSettings, tracklist, track, nunjucks) {

  'use strict';

  var DEBUG = localSettings.DEBUG;

  if (DEBUG || !nunjucks.env) {
    // If not precompiled, create an environment with an HTTP loader
    nunjucks.env = new nunjucks.Environment(new nunjucks.HttpLoader('/templates'));
  }

  var body = $('body');

  var currentUser = localStorage.getItem('personaEmail');
  var windowPath = window.location.pathname;

  if (windowPath !== '/') {
    $.get(windowPath, function (data) {
      body.find('section').html(
        nunjucks.env.getTemplate(data.template).render({ data: data.data })
      );
    });
  } else {
    if (currentUser) {
      body.find('section').html(
        nunjucks.env.getTemplate('dashboard.html').render()
      );
    } else {
      body.find('section').html(
        nunjucks.env.getTemplate('home.html').render()
      );
    }
  }

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
    }
  });
});
