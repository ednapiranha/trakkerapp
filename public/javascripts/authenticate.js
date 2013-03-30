define(['jquery', 'nunjucks', 'templates'],
  function ($, nunjucks) {

  var currentUser = localStorage.getItem('personaEmail');
  var body = $('body');

  'use strict';

  navigator.id.watch({
    loggedInUser: currentUser,
    onlogin: function (assertion) {
      $.ajax({
        type: 'POST',
        url: '/persona/verify',
        data: { assertion: assertion },
        success: function (res, status, xhr) {
          localStorage.setItem('personaEmail', res.email);
          body.find('header').find('a').data('action', 'logout')
                                       .text('Sign out');
          body.find('section').html(
            nunjucks.env.getTemplate('dashboard.html').render()
          );
        },
        error: function(res, status, xhr) {
          self.status
            .addClass('error')
            .text('There was an error logging in')
            .addClass('on');

          settings.statusTimer(self.status);
        }
      });
    },
    onlogout: function() {
      $.ajax({
        url: '/persona/logout',
        type: 'POST',
        success: function(res, status, xhr) {
          localStorage.removeItem('personaEmail');
          window.location.reload();
        },
        error: function(res, status, xhr) {
          console.log('logout failure ', res);
        }
      });
    }
  });
});
