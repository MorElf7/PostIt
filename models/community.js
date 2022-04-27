const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: String,
    description: String,
    logo: {
            url: String,
            filename: String
    },
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
    createdAt: Date
});

module.exports = mongoose.model('Community', communitySchema);