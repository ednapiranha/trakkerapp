var express = require('express');
var configurations = module.exports;
var app = express();
var server = require('http').createServer(app);
var nconf = require('nconf');
var settings = require('./settings')(app, configurations, express);
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

env.express(app);
nconf.argv().env().file({ file: 'local.json' });

/* Filters for routes */

var isLoggedIn = function(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    res.redirect('/');
  }
};

var hasProfile = function(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/');
  }
};

require('express-persona')(app, {
  audience: nconf.get('domain') + ':' + nconf.get('authPort')
});

// routes
require('./routes')(app, isLoggedIn, hasProfile);

app.listen(process.env.PORT || nconf.get('port'));
