const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String,
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
})

imageSchema.virtual('smallLogo').get(function() {
    return this.url.replace('/upload', '/upload/w_50,h_500,c_fill');
})

const communitySchema = new Schema({
    name: String,
    description: String,
    logo: imageSchema,
    open: Boolean,
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    moderators:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    createdAt: Date
});

module.exports = mongoose.model('Community', communitySchema);