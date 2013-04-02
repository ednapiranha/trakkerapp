define(['jquery', 'user', 'nunjucks', 'templates'],
  function ($, user, nunjucks) {

  var currentUser = localStorage.getItem('personaEmail');
  var body = $('body');

  'use strict';

  if (body.find('.actions a.authenticate').attr('data-action') === 'logout') {
    body.find('header .actions a.profile').removeClass('hidden');
  }

  navigator.id.watch({
    loggedInUser: currentUser,
    onlogin: function (assertion) {
      $.ajax({
        type: 'POST',
        url: '/persona/verify',
        data: { assertion: assertion },
        success: function (res, status, xhr) {
          localStorage.setItem('personaEmail', res.email);
          body.find('header .actions a.profile').removeClass('hidden');
          body.find('header .actions a.authenticate').data('action', 'logout')
                                                     .text('Sign out');
          user.get();
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
          body.find('header .actions a.profile').addClass('hidden');
          body.find('header .actions a').data('action', 'login')
                                        .text('Sign in');
          user.get();
        },
        error: function(res, status, xhr) {
          console.log('logout failure ', res);
        }
      });
    }
  });
});
