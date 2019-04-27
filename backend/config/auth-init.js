const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

const ERR = 'Authentication error!';

module.exports = function () {
  passport.use(
    new LocalStrategy(
      {usernameField: 'email'},
      (email, password, done) => {
        User.findOne({email})
          .then(user => {
            if (!user) {
              return done(ERR, false, {message: 'That email is not registered'});
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) return done(ERR, false);
              if (isMatch) return done(null, user);
              return done(ERR, false, {message: 'Password incorrect'});
            });
          });
      })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    done(null, id);
  });
};
