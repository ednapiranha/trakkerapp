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
        window.history.pushState(null, null, '/tracklists/' + data.data.id);
        body.find('section').html(
          nunjucks.env.getTemplate(data.template).render({
            data: data.data
          })
        );
      }).fail(function (data) {
        console.log('could not add tracklist');
      });
    }
  };

  return self;
});
