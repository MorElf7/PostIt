const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
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
        require: true
    }
});

module.exports = mongoose.model('User', userSchema);