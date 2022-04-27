const ExpressError = require("./utils/ExpressError");
const Post = require('./models/post');
const User = require('./models/user');
const {postSchema, userSchema} = require('./schemas');

module.exports.isSignIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/users/signin');
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    next();
}

module.exports.isUser = async (req, res, next) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    if (!user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/${userId}`);
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}