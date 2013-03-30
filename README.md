# TrakkerApp

## Installation instructions

Clone the repository

> git clone git://github.com/ednapiranha/trakkerapp.git

> curl http://npmjs.org/install.sh | sh

Install node by using brew or through the website http://nodejs.org/#download

> cd trakkerapp

> cp local.json-dist local.json

> npm install

## Setting up nunjucks

This will allow you to compile your templates for production

To read more about nunjucks, check out the [documentation](http://nunjucks.jlongster.com)

Install [node](http://nodejs.org)

> npm install

Download nunjucks and add it to trakkerapp/public/javascripts/lib/nunjucks.js

If you are on development mode, use [nunjucks-dev.js](https://github.com/jlongster/nunjucks/blob/master/browser/nunjucks-dev.js)

If you are on production and have precompiled your templates, use [nunjucks-min.js](https://github.com/jlongster/nunjucks/blob/master/browser/nunjucks-min.js)

## Precompiling templates for nunjucks

In development mode, make sure detour/static/js/templates.js only has the following:
    define(function() {});

In production mode, run the following:

    node_modules/nunjucks/bin/precompile trakkerapp/public/templates > trakkerapp/public/javascripts/templates.js

## Minifying files with Grunt

> grunt

## Configure client-side settings

If you need to override detour/static/js/settings.js, create detour/static/js/local_settings.js and return the new values. For example:

    define([],
      function () {

      'use strict';

      return {
        DEBUG: true
      };
    });

## Run the site

> node app.js

## Tests

> make test
