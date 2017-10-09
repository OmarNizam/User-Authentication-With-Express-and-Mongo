var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })  // tell mongoose to setup a query to find the document with the user's email address.
      .exec(function (error, user) { // use the exec method to perform the search and provide a callback to process the result.
        if(error) {
          return callback(error);
        } else if( !user ) {
          var err =  new Error('User not found!!');
          err.staus = 401;
          return callback(err);
        }
        // use bcrypt.compare method to compare the supplied passwords with the hashed version.
        // it returns error if something went wrong or result boolean : True if password match or False if not.
        bcrypt.compare(password, user.password, function(error, result) {   // three arguments : login password, hashed password and a callback function.
          if( result === true ) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}

// hash password before saving to database by calling the pre method on our Schema
// mongoose provides a function called pre-save hook
UserSchema.pre('save', function(next) {   // save is the hook name
  var user = this;    // this refers to the object we created containing the information the user entered in the signUp form.
  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;
