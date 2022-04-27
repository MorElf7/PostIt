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
    wrapAsync(Community.create))

//Edit
router.get('/:communityId/settings',
    wrapAsync(Community.edit))

router.put('/:communityId',
    wrapAsync(Community.update))

//Delete
router.delete('/:communityId',
    wrapAsync(Community.delete))

//Show
router.get('/:communityId',
    wrapAsync(Community.show))

module.exports = router