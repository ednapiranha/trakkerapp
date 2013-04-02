define(['jquery', 'utils'],
  function ($, utils) {
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
        utils.showNotification('updated!');
      }).fail(function (data) {
        console.log('could not update track');
      });
    },

    delete: function (self) {
      $.ajax({
        url: self.attr('data-url'),
        type: 'DELETE'
      }).done(function (data) {
        self.closest('li').remove();
        console.log('deleted track');
        utils.showNotification('deleted!');
      }).fail(function (data) {
        console.log('could not delete track');
      });
    }
  };

  return self;
});
