const ExpressError = require("./utils/ExpressError");
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');
const Community = require('./models/community');
const {postSchema, userSchema, commentSchema} = require('./schemas');

module.exports.isSignIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/users/signin');
    }
    next()
}

module.exports.isPostAuthor = async (req, res, next) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const {userId, postId, commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    next();
}

module.exports.isMember = async (req, res, next) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId);
    if (!community.members.find(e => e._id.equals(req.user._id))) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/communities/${communityId}`);
    }
    next();
}

module.exports.isMods = async (req, res, next) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId);
    if (!community.moderators.find(e => e._id.equals(req.user._id))) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/communities/${communityId}`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId);
    if (!community.admin.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/communities/${communityId}`);
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

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}