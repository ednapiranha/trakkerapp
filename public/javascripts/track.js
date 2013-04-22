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
        utils.showNotification('could not update track');
      });
    },

    search: function (form) {
      $.ajax({
        url: form.data('url'),
        data: form.serialize(),
        type: 'POST',
        dataType: 'json'
      }).done(function (data) {
        console.log('search found');
        utils.loadTemplate(data.template, data);
      }).fail(function (data) {
        console.log('could not search for tracks');
        utils.showNotification('could not search for tracks');
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
        utils.showNotification('could not delete track');
      });
    }
  };

  return self;
});
