const Joi = require("joi").extend(require('@joi/date'));
const ExpressError = require("./utils/ExpressError");

module.exports.isSignIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/users/signin');
    }
    next()
}

module.exports.validatePost = (req, res, next) => {
    const postSchema = Joi.object({
        post: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string(),
        }).required()
    })
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        user: Joi.object({
            email: Joi.string().required(),
            bio: Joi.string(),
            posts: Joi.array({
                
            }),
            joinedAt: Joi.date()
        }).required()
    })
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}