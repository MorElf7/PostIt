if (!process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/PostIt';
// const dbUrl = 'mongodb://127.0.0.1:27017/PostIt';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const captitalize = (s) => {
    const lower = s.toLowerCase();
    return s.charAt(0).toUpperCase() + lower.slice(1)
}

const accounts = ['tim', 'tom', 'bob', 'brad', 'jerry', 'colt', 'jose', 'alex', 'steve', 'stephen']

const seedDB = async () => {
    for (let acc of accounts) {
        const password = acc;
        const user = new User({email: acc + "@gmail.com", username: acc, bio: "Hey, I am " + captitalize(acc), joinedAt: Date.now(), avatar: {}});
        const registeredUser = await User.register(user, password);
        registeredUser.avatar.url = 'https://res.cloudinary.com/damrqx5dg/image/upload/v1651280572/PostIt/default_avatar_rm90mb.jpg';
        registeredUser.avatar.filename = 'default_avatar_rm90mb';
        registeredUser.follows.push(registeredUser._id);
        for (let i = 1; i <= 50; i++) {
            const post = new Post({
                title: 'Post Number ' + i.toString( ),
                description: 'Just Do It',
                joinedAt: Date.now(),
                user: registeredUser._id,
            });
            registeredUser.posts.push(post);
            await post.save();
        }

        registeredUser.posts.sort((a, b) => {
            return a.updatedAt > b.updatedAt ? 1 : -1;
        });

        await registeredUser.save();
    }
    console.log('Done!')
}

seedDB();