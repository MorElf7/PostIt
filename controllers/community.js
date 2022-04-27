const User = require('../models/user');
const Community = require('../models/community');
const cloudinary = require('cloudinary').v2;
const ExpressError = require('../utils/ExpressError');
const flash = require('connect-flash/lib/flash');

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
    await community.save();
    req.flash('success', 'Successfully create a community');
    res.redirect(`/communities/${community._id}`);
}

module.exports.edit = async (req, res) => {
    const {communityId} = req.params;
    const community = await Community.findById(communityId)
                        .populate({path: 'admin', select: ['username', '_id', 'avatar']})
                        .populate({path: 'moderators', select: ['username', '_id', 'avatar']})
                        .populate({path: 'members', select: ['username', '_id', 'avatar']});
    if (!community) {
        req.flash('error', 'The community you are lookng for do not exist');
        res.redirect(``);
    }
    const pageTitle = "Community Settings";
    res.render('community/edit', {community, pageTitle});
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
                        .populate({path: 'members', select: ['username', '_id', 'avatar']});
    if (!community) {
        req.flash('error', 'The community you are lookng for do not exist');
        res.redirect(``);
    }
    const pageTitle = community.name;
    res.render('community/home', {community, pageTitle});
}