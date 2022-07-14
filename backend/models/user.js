const mongoose = require('mongoose');
const Post = require('./post');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const avatarSchema = new Schema({
    url: String,
    filename: String
})

avatarSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
})
avatarSchema.virtual('smallAvatar').get(function() {
    return this.url.replace('/upload', '/upload/w_50,h_50,c_fill');
})

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: avatarSchema,
    follows: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    bio: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    joinedAt: Date
});
userSchema.plugin(passportLocalMongoose);

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Post.deleteMany({
            _id: doc.posts
        })
    }
})

userSchema.index({username: "text"});


module.exports = mongoose.model('User', userSchema);