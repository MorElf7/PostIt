const User = require('../models/user');
const Community = require('../models/community');
const cloudinary = require('cloudinary').v2;
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const communities = await Community.find({});
    const pageTitle = "Communities"
    res.render('community/index', {communities, pageTitle})
}

module.exports.new = (req, res) => {
    const pageTitle = "New Community";
    res.render('community/new', {pageTitle})
}

module.exports.create = async (req, res) => {
    const community = new Community(req.body.community);
    const admin = await User.findById(req.user._id);
    community.admin = admin;
    community.createdAt = Date.now();
    community.members.push(admin);
    community.moderators.push(admin);
    if (req.body.open) {
        community.open = true;
    } else community.open = false;
    if (req.file) {
        community.logo.url = req.file.path;
        community.logo.filename = req.file.filename;
    }
    await community.save();
    req.flash('success', 'Successfully create a community');
    res.redirect(`/communities/${community._id}`);
}

module.exports.settings = async (req, res) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId)
                        .populate('admin')
                        .populate('moderators')
                        .populate('members');
    if (!community) {
        req.flash('error', 'The community you are lookng for do not exist');
        res.redirect(``);
    }
    const pageTitle = "Community Settings";
    res.render('community/settings', {community, pageTitle});
}

module.exports.update = async (req, res) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId);
    if (!community) {
        req.flash('error', 'The community you are lookng for do not exist');
        res.redirect(``);
    }
    await community.updateOne(req.body.community);
    community.logo.url = req.file.path;
    community.logo.filename = req.file.filename;
    await community.save();
    res.flash('success', 'Successfully update community setting');
    res.redirect(`/communities/${communityId}`);
}

module.exports.delete = async (req, res) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId);
    if (community.logo.filename) {
        await cloudinary.uploader.destroy(community.logo.filename);
    }
    await community.deleteOne();
    res.redirect('/communities');
}

module.exports.show = async (req, res) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId)
                        .populate({path: 'admin', select: ['username', '_id', 'avatar']})
                        .populate({path: 'moderators', select: ['username', '_id', 'avatar']})
                        .populate({path: 'members', select: ['username', '_id', 'avatar']})
                        .populate({path: 'posts', populate: {path: 'user', select: ['username', '_id', 'avatar']}});
    if (!community) {
        req.flash('error', 'The community you are lookng for do not exist');
        res.redirect(``);
    }
    const pageTitle = community.name;
    res.render('community/home', {community, pageTitle});
}

module.exports.newPost = async (req, res) => {
    const pageTitle = 'New Post';
    const community = await Community.findById(req.params.communityId)
    res.render('community/newPost', {community, pageTitle});
}

module.exports.createPost = async (req, res) => {
    const {communityId} = req.params;
    const post = new Post(req.body.post);
    const user = await User.findById(req.user._id);
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
    const community = await Community.findById(communityId);
    community.posts.push(post);
    if (community.posts.length >= 2) {
        community.posts.sort((a, b) => {
            return a.updatedAt < b.updatedAt ? 1 : -1;
        });
    }
    await community.save();
    await post.save();
    await user.save();
    res.redirect(`/communities/${communityId}`);
}

module.exports.editPost = async (req, res) => {
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

module.exports.updatePost = async (req, res) => {
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

module.exports.deletePost = async (req, res) => {
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

module.exports.readPost = async (req, res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId).populate('user').populate({path: 'comments', populate: 'user'});
    if (!post) {
        req.flash('error', 'The post do not exist')
        return res.redirect(`/${userId}`)
    }
    const pageTitle = post.title;
    res.render('posts/details', {post, pageTitle});
}