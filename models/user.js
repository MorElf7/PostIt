const mongoose = require('mongoose');
const Post = require('./post');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    avatar: {
        url: String,
        filename: String
    },
    bio: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
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


module.exports = mongoose.model('User', userSchema);