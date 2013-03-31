define(['jquery', 'nunjucks', 'templates'],
  function ($, nunjucks) {
  'use strict';

  var body = $('body');

  var self = {
    loadTemplate: function (template, data) {
      body.find('section').html(
        nunjucks.env.getTemplate(template).render({ data: data.data || data })
      );
    }
  };

  return self;
});
