define(['jquery', 'utils'],
  function ($, utils) {
  'use strict';

  var body = $('body');
  var windowPath = window.location.pathname;

  var self = {
    get: function () {
      $.ajax({
        url: '/me',
        type: 'GET',
        dataType: 'json'
      }).done(function (data) {
        console.log('retrieved profile');
        if (windowPath === '/') {
          utils.loadTemplate(data.template, data);
        } else {
          $.get(windowPath, function (data) {
            if (data.data.artist) {
              document.title = 'Trakker: ' + data.data.artist + ' - ' + data.data.title;
            }
            utils.loadTemplate(data.template, data);
          });
        }
      }).fail(function (data) {
        console.log('could not retrieve profile');
        if (localStorage.getItem('personaEmail')) {
          utils.loadTemplate('profile.html', data);
        } else {
          utils.loadTemplate('home.html', {});
        }
      });
    },

    update: function (form) {
      $.ajax({
        url: '/me',
        type: 'POST',
        data: form.serialize(),
        dataType: 'json'
      }).done(function (data) {
        console.log('updated profile');
        utils.showNotification('updated!');
      }).fail(function (data) {
        console.log('could not update profile');
      });
    }
  };

  return self;
});
