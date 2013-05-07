define(['jquery', 'utils'],
  function ($, utils) {
  'use strict';

  var body = $('body');

  var self = {
    add: function (form) {
      $.ajax({
        url: form.data('url'),
        data: form.serialize(),
        type: 'POST',
        dataType: 'json'
      }).done(function (data) {
        history.pushState(data, data.data.title, '/tracklists/' + data.data.id);
        utils.loadTemplate(data.template, data);
      }).fail(function (data) {
        console.log('could not add tracklist');
      });
    },

    update: function (form) {
      $.ajax({
        url: form.data('url'),
        data: form.serialize(),
        type: 'PUT',
        dataType: 'json'
      }).done(function (data) {
        console.log('updated tracklist');
        body.find('h1 a').text(data.tracklist.artist + ' - ' + data.tracklist.title);
        utils.showNotification('updated!');
      }).fail(function (data) {
        console.log('could not update tracklist');
      });
    },

    del: function (self) {
      $.ajax({
        url: self.attr('data-url'),
        type: 'DELETE'
      }).done(function (data) {
        document.location.href = '/';
      }).fail(function (data) {
        console.log('could not delete tracklist');
      });
    }
  };

  return self;
});
