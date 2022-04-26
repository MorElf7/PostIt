const User = require('../models/user');
const ExpressError = require('../utils/ExpressError')

module.exports.index = async (req, res) => {
    const users = await User.find({});
    res.render('users/index', {users, pageTitle: "All Users"});
}

module.exports.new =  (req, res) => {
    const pageTitle = 'Sign Up';
    res.render('users/signup', {pageTitle});
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.signinform = (req, res) => {
    const pageTitle = 'Sign In';
    res.render('users/signin', {pageTitle});
}

module.exports.signin = (req, res) => {
    const user = req.user
    req.flash('success', 'Signed In!');
    const redirectUrl = req.session.returnTo || `/${user._id}`;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.signout = (req, res) => {
    req.logout();
    req.flash('success', 'Signed Out');
    res.redirect('/');
}

module.exports.show = async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId).populate('posts');
    const pageTitle = user.username;
    res.render('users/home', {user, pageTitle});
}

module.exports.edit = async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    const pageTitle = user.username;
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect(`/`)
    }
    if (!user._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}`);
    }
    res.render('users/edit', {pageTitle});
}

module.exports.update = async (req, res) => {
    const {userId} = req.params;
    const pageTitle = user.username;
    const user = await User.findById(userId);
    if (!user._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}`);
    }
    user = req.body.user;
    await user.save();
    res.redirect(`/${userId}`, {pageTitle});
}