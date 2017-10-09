var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /login
router.get('/login', function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

// POST /login
router.post('/', function(req, res, next) {
  return res.send('Logged In!');
});

// GET /register
router.get('/register', function(req, res, next) {
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
