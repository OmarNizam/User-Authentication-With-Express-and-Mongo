var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

// GET /logout
router.get('/logout', function(req, res, next) {
  if( req.session ) {
    // Delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if(error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if(error || !user) {
        var err = new Error('Wrong email or password!');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    }); // User is our model and the authenticate func you find it in user model
  } else {
    var err = new Error('email and password are required !!');
    err.status = 401; // 401 status code means unauthorized
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up'});  // look to the title in layout.pug
})
// POST /register
router.post('/register', function(req, res, next) {
  // error checking code
  if(req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {

      // Confirm that user typed same password twice
      if(req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords dont match!!');
        err.status = 400;
        return next(err);
      }

      // Create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password,
      }

      // use `create` method to insert document into mongo
      User.create(userData, function(error, user) {
        if(error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else {
      // create error
      var err = new Error('All fields required!!');
      err.status = 400; // 400 is http status code means bad request
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
