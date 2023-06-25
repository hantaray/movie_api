const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [
        {
            name: String,
            description: String
        }
    ],
    director: {
        name: String,
        bio: String
    },
    imagePath: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// Don't use arrow functions when defining instance methods! (validatePassword is an instance method)
userSchema.methods.validatePassword = function (password) {
    console.log('password', password)
    console.log('this.password', this.password)
    return bcrypt.compare(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;