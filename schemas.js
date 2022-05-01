const sanitizeHtml = require("sanitize-html");

const BaseJoi = require("joi").extend(require('@joi/date'));
BaseJoi.objectId = require('joi-objectid')(BaseJoi)

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.postSchema = Joi.object({
    image: Joi.object({
        url: Joi.string().allow('').required().escapeHTML(),
        filename: Joi.string().allow('').required().escapeHTML(),
    }),
    post: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required()
})

module.exports.userSchema = Joi.object({
    avatar: Joi.object({
        url: Joi.string().allow('').required().escapeHTML(),
        filename: Joi.string().allow('').required().escapeHTML(),
    }),
    oldPassword: Joi.string().allow('').escapeHTML(),
    newPassword: Joi.string().allow('').escapeHTML(),
    user: Joi.object({
        username: Joi.string().alphanum().required().escapeHTML(),
        email: Joi.string().email().required().escapeHTML(),
        bio: Joi.string().allow('').escapeHTML(),
        posts: Joi.array(),
        joinedAt: Joi.date(),
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        content: Joi.string().required().escapeHTML()
    }).required()
})