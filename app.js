const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/RedditClone');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/post', async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts});
});

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.render('users/index', {users});
});

app.get('/:userid', async (req, res) => {
    const {userid} = req.params;
    const user = await User.findById(userid).populate('posts');
    res.render('users/home', {user});
});


app.listen(3000, () => {
    console.log("Serving on port 3000");
});