const express = require('express');
const router = express.Router({mergeParams: true});

const Comment = require('../controllers/comment')
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

router.post('/', 
    middlewares.isSignIn, 
    middlewares.validateComment,
    wrapAsync(Comment.create))

router.put('/:commentId', 
    middlewares.isSignIn,
    middlewares.isCommentAuthor,
    middlewares.validateComment,
    wrapAsync(Comment.update))

//Delete
router.delete('/:commentId', 
    middlewares.isSignIn, 
    middlewares.isCommentAuthor,
    wrapAsync(Comment.delete))

module.exports = router;