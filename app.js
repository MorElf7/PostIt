const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Post = require('./models/post');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync');

mongoose.connect('mongodb://127.0.0.1:27017/RedditClone');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', wrapAsync((req, res) => {
    res.render('home');
}))

//List all posts
app.get('/posts', wrapAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', {posts});
}))

//List all users
app.get('/users', wrapAsync(async (req, res) => {
    const users = await User.find({});
    res.render('users/index', {users});
}))

//Show Post
app.get('/:userId/posts/:postId', wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId).populate('user');
    res.render('posts/details', {post, userId});
}))

//Create Post
app.get('/:userId/posts/new', (req, res) => {
    const {userId} = req.params;
    res.render('posts/new', {userId});
})

app.post('/:userId/posts', wrapAsync(async (req, res) => {
    const {userId} = req.params;
    const post = new Post(req.body.post);
    const user = await User.findById(userId);
    post.user = user;
    user.posts.push(post);
    await post.save();
    await user.save();
    res.redirect(`/${userId}`);
}))

//Edit Post
app.get('/:userId/posts/:postId/edit', wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    const post = await Post.findById(postId);
    res.render('posts/edit', {post, userId});
}))

app.put('/:userId/posts/:postId', wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    await Post.findByIdAndUpdate(postId, {...req.body.post});
    res.redirect(`/${userId}/posts/${postId}`);
}))

//Delete Post
app.delete('/:userId/posts/:postId', wrapAsync(async (req, res) => {
    const {userId, postId} = req.params;
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(userId);
    user.posts.splice(user.posts.indexOf(postId), 1);
    user.save();
    res.redirect(`/${userId}`);
}))

//Show User
app.get('/:userId', wrapAsync(async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId).populate('posts');
    res.render('users/home', {user});
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {message = "Something went wrong", statusCode = 500} = err;
    res.status(statusCode)
    res.send(message)
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})