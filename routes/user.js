const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//List all users
router.get('/users', wrapAsync(async (req, res) => {
    const users = await User.find({});
    res.render('users/index', {users, pageTitle: "All Users"});
}))

//Register
router.get('/users/signup', wrapAsync(async (req, res) => {
    const pageTitle = 'Sign Up';
    res.render('users/signup', {pageTitle});
}))

router.post('/users', wrapAsync(async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username, bio: "",joinedAt: Date.now()});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PostIt');
            res.redirect(`/${registeredUser._id}`);
        })   
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/signup');
    }
}))

//Sign In
router.get('/users/signin', (req, res) => {
    const pageTitle = 'Sign In';
    res.render('users/signin', {pageTitle});
})

router.post('/users/signin', passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/signin'}), (req, res) => {
    const user = req.user
    req.flash('success', 'Signed In!');
    const redirectUrl = req.session.returnTo || `/${user._id}`;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//Sign Out
router.get('/users/signout', (req, res) => {
    req.logout();
    req.flash('success', 'Signed Out');
    res.redirect('/');
})

//Show User
router.get('/:userId', wrapAsync(async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId).populate('posts');
    const pageTitle = user.username;
    res.render('users/home', {user, pageTitle});
}))

//Edit User
router.get('/:userId/edit', middlewares.isSignIn, wrapAsync(async (req, res) => {
    const {userId} = req.params;
    const pageTitle = user.username;
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect(`/`)
    }
    if (!user._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}`);
    }
    res.render('users/edit', {pageTitle});
}))

router.put('/:userId', middlewares.isSignIn, wrapAsync(async (req, res) => {
    const {userId} = req.params;
    const pageTitle = user.username;
    const user = await User.findById(userId);
    if (!user._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}`);
    }
    res.redirect(`/${userId}`, {pageTitle});
}))

module.exports = router