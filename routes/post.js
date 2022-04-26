const express = require('express');
const router = express.Router();

const Post = require('../controllers/post')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//List all posts
router.get('/posts', 
    wrapAsync(Post.index))

//Create Post
router.get('/:userId/posts/new', 
    middlewares.isSignIn, 
    Post.new)

router.post('/:userId/posts', 
    middlewares.isSignIn, 
    middlewares.validatePost, 
    wrapAsync(Post.create))

//Edit Post
router.get('/:userId/posts/:postId/edit', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    wrapAsync(Post.edit))

router.put('/:userId/posts/:postId', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    middlewares.validatePost, 
    wrapAsync(Post.update))

//Delete Post
router.delete('/:userId/posts/:postId', 
    middlewares.isSignIn, 
    middlewares.isAuthor, 
    wrapAsync(Post.delete))

//Show Post
router.get('/:userId/posts/:postId', 
    wrapAsync(Post.read))

module.exports = router;