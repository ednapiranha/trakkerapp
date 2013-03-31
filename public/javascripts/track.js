define(['jquery'],
  function ($) {
  'use strict';

  var self = {
    update: function (form) {
      $.ajax({
        url: form.data('url'),
        data: form.serialize(),
        type: 'PUT',
        dataType: 'json'
      }).done(function (data) {
        console.log('updated track');
      }).fail(function (data) {
        console.log('could not update track');
      });
    }
  };

  return self;
});
