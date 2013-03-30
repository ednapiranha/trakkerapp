'use strict';

var nconf = require('nconf');
var Sequelize = require('sequelize');

if (process.env.NODE_ENV && process.env.NODE_ENV === 'test') {
  nconf.argv().env().file({ file: 'local-test.json' });
} else {
  nconf.argv().env().file({ file: 'local.json' });
}

var sequelize = new Sequelize(
  nconf.get('database'),
  nconf.get('db_username'),
  nconf.get('db_password'), {
    define: {
      underscored: true,
      charset: 'utf8'
    },
    sync: { force: true },
    syncOnAssociation: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    pool: {
      maxConnections: 5,
      maxIdleTime: 30
    }
  }
);

var User = sequelize.define('user', {
  'username': {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING,
    validate: {
      is: ['[A-Z0-9_]','gi'],
      len: [1, 20]
    }
  },
  'email': Sequelize.STRING,
  'location': Sequelize.STRING
});

var Tracklist = sequelize.define('tracklist', {
  'artist': {
    allowNull: false,
    type: Sequelize.STRING
  },
  'title': {
    allowNull: false,
    type: Sequelize.STRING
  },
  'released': Sequelize.DATE
});

var Track = sequelize.define('track', {
  'artist': {
    allowNull: false,
    type: Sequelize.STRING
  },
  'title': {
    allowNull: false,
    type: Sequelize.STRING
  },
  'keywords': {
    type: Sequelize.STRING
  },
  'pos': {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
});

Tracklist.hasMany(Track);
User.hasMany(Tracklist);

Tracklist.belongsTo(User);

User.sync();
Tracklist.sync();
Track.sync();

exports.getUser = function() {
  return User;
};

exports.getTracklist = function() {
  return Tracklist;
};

exports.getTrack = function() {
  return Track;
};
