const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

const User = require('../controllers/user');
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//List all users
router.get('/users', 
    wrapAsync(User.index))

//Register
router.get('/users/signup', 
    User.new)

router.post('/users', 
    middlewares.validateUser, 
    wrapAsync(User.signup))

//Sign In
router.get('/users/signin', 
    User.signinform)

router.post('/users/signin', 
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/signin'}), 
    User.signin)

//Sign Out
router.get('/users/signout', 
    User.signout)

//Show User
router.get('/:userId', 
    wrapAsync(User.show))

//Edit User
router.get('/:userId/edit', 
    middlewares.isSignIn, 
    middlewares.validateUser, 
    wrapAsync(User.edit))

router.put('/:userId', 
    middlewares.isSignIn, 
    wrapAsync(User.update))

module.exports = router