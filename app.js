const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const Joi = require('joi');

const User = require('./models/user');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync');

mongoose.connect('mongodb://127.0.0.1:27017/PostIt');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'static')));

const sessionConfig = {
    secret: 'developmentsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }  
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', wrapAsync((req, res) => {
    res.render('home', {pageTitle: "Home"});
}))

app.use('/', postRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error', {err , pageTitle: 'Error'});
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})