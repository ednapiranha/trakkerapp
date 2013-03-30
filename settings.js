// Module dependencies.
module.exports = function(app, configurations, express) {
  var clientSessions = require('client-sessions');
  var nconf = require('nconf');

  nconf.argv().env().file({ file: 'local.json' });

  // Configuration
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    if (nconf.get('debug')) {
      app.use(express.logger('dev'));
    }
    app.use(express.static(__dirname + '/public'));
    app.use(clientSessions({
      cookieName: nconf.get('session_cookie'),
      secret: nconf.get('session_secret'),
      duration: 24 * 60 * 60 * 1000 * 28 // 4 weeks
    }));
    app.use(function(req, res, next) {
      res.locals.session = req.session;
      res.locals.debug = nconf.get('debug');
      next();
    });
    app.locals.pretty = true;
    app.use(app.router);
    app.use(function(req, res, next) {
      res.status(404);
      res.json({ 'message': 'Page not found' });
      return;
    });
    app.use(function(req, res, next) {
      res.status(403);
      res.json({ 'message': 'Not allowed' });
      return;
    });
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({ 'message': 'Something went wrong' });
    });
  });

  app.configure('development, test', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('prod', function(){
    app.use(express.errorHandler());
  });

  return app;
};
