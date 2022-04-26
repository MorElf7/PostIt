if (!process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo");

const allowedContent = require('./allowedContent');
const User = require('./models/user');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const ExpressError = require('./utils/ExpressError')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/PostIt';
mongoose.connect('mongodb://127.0.0.1:27017/PostIt');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Serving on port 3000");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(mongoSanitize())

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...allowedContent.connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...allowedContent.scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...allowedContent.styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/damrqx5dg/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...allowedContent.fontSrcUrls],
        },
    })
);

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: 'developmentsecret',
    touchAfter: 2 * 60 * 60
})

store.on('error', function(e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'developmentsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
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


app.get('/', (req, res) => {
    res.render('home', {pageTitle: 'Home'});
})

app.use('/', postRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode)
    res.render('error', {err , pageTitle: 'Error'});
})