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
            utils.loadTemplate(data.template, data);
          });
        }
      }).fail(function (data) {
        console.log('could not retrieve profile');
        utils.loadTemplate('profile.html', data);
      });
    },

    update: function (form) {
      $.ajax({
        url: '/me',
        type: 'POST',
        data: form.serialize(),
        dataType: 'json'
      }).done(function (data) {
        console.log('retrieved profile');

      }).fail(function (data) {
        console.log('could not update profile');

      });
    }
  };

  return self;
});
