define(['jquery', 'utils'],
  function ($, utils) {
  'use strict';

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
    }
  };

  return self;
});
