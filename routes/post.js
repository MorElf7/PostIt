const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

const Post = require('../controllers/post')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//Create Post
router.get('/new', 
    middlewares.isSignIn, 
    Post.new)

router.post('', 
    middlewares.isSignIn, 
    middlewares.isUser,
    upload.single('image'),
    middlewares.validatePost, 
    wrapAsync(Post.create))

//Edit Post
router.get('/:postId/edit', 
    middlewares.isSignIn, 
    middlewares.isPostAuthor, 
    wrapAsync(Post.edit))

router.put('/:postId', 
    middlewares.isSignIn, 
    middlewares.isPostAuthor, 
    upload.single('image'),
    middlewares.validatePost, 
    wrapAsync(Post.update))

//Delete Post
router.delete('/:postId', 
    middlewares.isSignIn, 
    middlewares.isPostAuthor, 
    wrapAsync(Post.delete))

//Show Post
router.get('/:postId', 
    wrapAsync(Post.read))

module.exports = router;