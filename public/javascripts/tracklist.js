define(['jquery', 'nunjucks', 'templates'],
  function ($, nunjucks) {

  var body = $('body');

  'use strict';

  var self = {
    add: function (form) {
      $.ajax({
        url: form.data('url'),
        data: form.serialize(),
        type: 'POST',
        dataType: 'json'
      }).done(function (data) {
        body.find('section').html(
          nunjucks.env.getTemplate('tracks.html').render({
            tracks: data.tracks
          })
        );
      }).fail(function (data) {
        console.log('could not add tracklist');
      });
    }
  };

  return self;
});
