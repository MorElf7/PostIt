const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    joinedAt: {
        type: Date,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema);