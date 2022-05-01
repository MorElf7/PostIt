const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const ExpressError = require('../utils/ExpressError');

module.exports.create = async (req, res) => {
    const {userId, postId} = req.params;
    const comment = new Comment(req.body.comment);
    const post = await Post.findById(postId);
    comment.user = req.user._id;
    comment.post = post;
    post.comments.push(comment);
    if (post.comments.length >= 2) {
        post.comments.sort((a, b) => {
            return a.updatedAt < b.updatedAt ? 1 : -1;
        });
    }
    await comment.save();
    await post.save();
    res.redirect(`/${userId}/posts/${postId}`);
}

module.exports.update = async (req, res) => {
    const {userId, postId, commentId} = req.params;
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/');
    }
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect('/');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash('error', 'The comment do not exist')
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    await comment.updateOne(req.body.comment);
    res.redirect(`/${userId}/posts/${postId}`);
}

module.exports.delete = async (req, res) => {
    const {userId, postId, commentId} = req.params;
    const user = User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/');
    }
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect('/');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash('error', 'The comment do not exist')
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    post.comments = post.comments.filter((e) => !e.equals(commentId));
    await post.save();
    await comment.deleteOne();
    res.redirect(`/${userId}/posts/${postId}`);
}
