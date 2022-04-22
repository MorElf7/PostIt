const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textPostSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('TextPost', textPostSchema);