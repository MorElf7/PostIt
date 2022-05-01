const express = require('express');
const router = express.Router({mergeParams: true});
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
router.get('/:userId/settings', 
    middlewares.isSignIn,  
    middlewares.isUser,
    wrapAsync(User.edit));

router.put('/:userId', 
    middlewares.isSignIn, 
    middlewares.isUser,
    upload.single('avatar'),
    middlewares.validateUser,
    wrapAsync(User.update))

router.patch('/:userId',
    middlewares.isSignIn, 
    wrapAsync(User.follow)
);

//Delete User
router.delete('/:userId',
    middlewares.isSignIn,
    middlewares.isUser,
    wrapAsync(User.delete))

module.exports = router