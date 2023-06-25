const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, done) => {
    console.log(username + '  ' + password);
    Users.findOne({ username: username })
        .then((user) => {
            console.log("Password correct: " + user.validatePassword(password))
            if (!user) {
                console.log('incorrect username');
                return done('incorrect username', false);
            }
            else if (!user.validatePassword(password)) {
                console.log('incorrect password');
                return done('incorrect password', false);
            }
            console.log(user);
            return done(null, user);
        })
        .catch((err) => {
            console.log(err);
            return done(err);
        });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, done) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return done(null, user);
        })
        .catch((err) => {
            return done(err);
        });
}));