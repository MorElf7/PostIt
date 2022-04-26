const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError')

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts, pageTitle: "All Posts"});
}

module.exports.new = (req, res) => {
    const {userId} = req.params;
    res.render('posts/new', {userId, pageTitle: "New Post"});
}

module.exports.create = async (req, res) => {
    const {userId} = req.params;
    const post = new Post(req.body.post);
    const user = await User.findById(userId);
    post.user = user;
    user.posts.push(post);
    await post.save();
    await user.save();
    req.flash('success', 'Successfully create a post');
    res.redirect(`/${userId}`);
}

module.exports.edit = async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    const pageTitle = `Editing ${post.title}`;
    res.render('posts/edit', {post, userId, pageTitle});
}

module.exports.update = async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    post = req.body.post;
    await post.save();
    req.flash('success', 'Successfully edit a post');
    res.redirect(`/${userId}/posts/${postId}`);
}

module.exports.delete = async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(userId);
    user.posts.splice(user.posts.indexOf(postId), 1);
    user.save();
    req.flash('success', 'Successfully delete a post');
    res.redirect(`/${userId}`);
}

module.exports.read = async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId).populate('user');
    const pageTitle = post.title;
    res.render('posts/details', {post, userId, pageTitle});
}