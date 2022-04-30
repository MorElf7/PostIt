const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const postSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
}, {timestamps: true});

postSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: doc.comments
        })
    }
})

module.exports = mongoose.model('Post', postSchema);