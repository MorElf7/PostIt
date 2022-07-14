const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

const Community = require('../controllers/community');
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//List all
router.get('/',
    wrapAsync(Community.index)
)

//Create
router.get('/new',
    // middlewares.isSignIn,
    Community.new)

router.post('/',
    middlewares.isSignIn,
    upload.single('logo'),
    wrapAsync(Community.create))

//Edit
router.get('/:communityId/settings',
    middlewares.isSignIn,
    middlewares.isAdmin,
    upload.single('logo'),
    wrapAsync(Community.settings))

router.put('/:communityId',
    middlewares.isSignIn,
    middlewares.isAdmin,
    wrapAsync(Community.update))

//Delete
router.delete('/:communityId',
    wrapAsync(Community.delete))

//Show
router.get('/:communityId',
    wrapAsync(Community.show))


//New Post
router.get('/:communityId/posts/new',
    middlewares.isSignIn,
    middlewares.isMember,
    wrapAsync(Community.newPost));

router.post('/:communityId/posts',
    middlewares.isSignIn,
    middlewares.isMember,
    wrapAsync(Community.createPost));



module.exports = router