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
    Users.findOne({ Username: username })
        .then((user) => {
            if (!user.validatePassword(password)) {
                console.log("incorrect password");
                return callback(null, false, { message: "Incorrect password." });
            }
            return callback(null, user);
        })
        .catch((e) =>
            callback(null, false, { message: "Incorrect username or password." })
        );
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