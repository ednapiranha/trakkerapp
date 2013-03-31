define(['jquery', 'nunjucks', 'templates'],
  function ($, nunjucks) {

  var body = $('body');

  'use strict';

  var _loadDefaultTemplate = function (data) {
    body.find('section').html(
      nunjucks.env.getTemplate('profile.html').render({ data: data.data })
    );
  };

  var self = {
    get: function () {
      $.ajax({
        url: '/me',
        type: 'GET',
        dataType: 'json'
      }).done(function (data) {
        console.log('retrieved profile');
        body.find('section').html(
          nunjucks.env.getTemplate(data.template).render({ data: data.data })
        );
      }).fail(function (data) {
        console.log('could not retrieve profile');
        _loadDefaultTemplate(data);
      });
    },

    update: function () {
      $.ajax({
        url: '/me',
        type: 'GET',
        dataType: 'json'
      }).done(function (data) {
        console.log('retrieved profile');
        body.find('section').html(
          nunjucks.env.getTemplate(data.template).render({ data: data.data })
        );
      }).fail(function (data) {
        console.log('could not retrieve profile');
        _loadDefaultTemplate(data);
      });
    }
  };

  return self;
});
