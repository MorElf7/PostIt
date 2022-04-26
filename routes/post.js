const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//List all posts
router.get('/posts', wrapAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts, pageTitle: "All Posts"});
}))

//Create Post
router.get('/:userId/posts/new', middlewares.isSignIn, (req, res) => {
    const {userId} = req.params;
    res.render('posts/new', {userId, pageTitle: "New Post"});
})

router.post('/:userId/posts', middlewares.isSignIn, middlewares.validatePost, wrapAsync(async (req, res) => {
    // if (!(req.body.post.title && req.body.post.description)) throw new ExpressError('Invalid Post', 400);
    const {userId} = req.params;
    const post = new Post(req.body.post);
    const user = await User.findById(userId);
    post.user = user;
    user.posts.push(post);
    await post.save();
    await user.save();
    req.flash('success', 'Successfully create a post');
    res.redirect(`/${userId}`);
}))

//Edit Post
router.get('/:userId/posts/:postId/edit', middlewares.isSignIn, wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    const pageTitle = `Editing ${post.title}`;
    res.render('posts/edit', {post, userId, pageTitle});
}))

router.put('/:userId/posts/:postId', middlewares.isSignIn, middlewares.validatePost, wrapAsync(async (req, res) => {
    // if (!(req.body.post.title && req.body.post.description)) throw new ExpressError('Invalid Post', 400);
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    post = req.body.post;
    post.save();
    // await Post.updateOne(, {...req.body.post});
    req.flash('success', 'Successfully edit a post');
    res.redirect(`/${userId}/posts/${postId}`);
}))

//Delete Post
router.delete('/:userId/posts/:postId', middlewares.isSignIn, wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    if (!post.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/${userId}/posts/${postId}`);
    }
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(userId);
    user.posts.splice(user.posts.indexOf(postId), 1);
    user.save();
    req.flash('success', 'Successfully delete a post');
    res.redirect(`/${userId}`);
}))

//Show Post
router.get('/:userId/posts/:postId', wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId).populate('user');
    const pageTitle = post.title;
    res.render('posts/details', {post, userId, pageTitle});
}))

module.exports = router;