const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const ExpressError = require('../utils/ExpressError')

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts, pageTitle: "All Posts"});
}

module.exports.new = (req, res) => {
    res.render('posts/new', {pageTitle: "New Post"});
}

module.exports.create = async (req, res) => {
    const {userId} = req.params;
    const post = new Post(req.body.post);
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/')
    }
    post.user = user;
    user.posts.push(post);
    if (user.posts.length >= 2) {
        user.posts.sort((a, b) => {
            return a.updatedAt < b.updatedAt ? 1 : -1;
        });
    }
    if (req.file) {
        if (post.image.filename) {
            await cloudinary.uploader.destroy(post.image.filename);
        }
        post.image.url = req.file.path;
        post.image.filename = req.file.filename;
    }
    await post.save();
    await post.save();
    await user.save();
    req.flash('success', 'Successfully create a post');
    res.redirect(`/${userId}`);
}

module.exports.edit = async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/')
    }
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    const pageTitle = `Editing ${post.title}`;
    res.render('posts/edit', {post, pageTitle});
}

module.exports.update = async (req, res) => {
    const {userId, postId} = req.params;
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/')
    }
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect('/')
    }
    await post.updateOne(req.body.post);
    if (post.image.filename) {
        await cloudinary.uploader.destroy(post.image.filename);
    }
    post.image.url = req.file.path;
    post.image.filename = req.file.filename;
    await post.save();
    req.flash('success', 'Successfully edit a post');
    res.redirect(`/${userId}/posts/${postId}`);
}

module.exports.delete = async (req, res) => {
    const {userId, postId} = req.params;
    const user = await User.findById(userId);
    if (!user) {
        req.flash('error', 'The user do not exist')
        return res.redirect('/')
    }
    const post = await Post.findById(postId);
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    user.posts = user.posts.filter((e) => !e.equals(postId))
    await user.save();
    await Post.findByIdAndDelete(postId);
    req.flash('success', 'Successfully delete a post');
    res.redirect(`/${userId}`);
}

module.exports.read = async (req, res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId)
                    .populate({path: 'user', select: ['username', '_id', 'avatar']})
                    .populate({path: 'comments', populate: {path: 'user', select: ['username', '_id', 'avatar']}});
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    const pageTitle = post.title;
    res.render('posts/details', {post, pageTitle});
}