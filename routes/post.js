const express = require('express');
const router = express.Router({mergeParams: true});

const Post = require('../controllers/post')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//Create Post
router.get('/new', 
    middlewares.isSignIn, 
    Post.new)

router.post('', 
    middlewares.isSignIn, 
    middlewares.validatePost, 
    wrapAsync(Post.create))

//Edit Post
router.get('/:postId/edit', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    wrapAsync(Post.edit))

router.put('/:postId', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    middlewares.validatePost, 
    wrapAsync(Post.update))

//Delete Post
router.delete('/:postId', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    wrapAsync(Post.delete))

//Show Post
router.get('/:postId', 
    wrapAsync(Post.read))

module.exports = router;