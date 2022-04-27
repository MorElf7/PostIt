const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

const Community = require('../controllers/community');
const wrapAsync = require('../utils/wrapAsync');
const middlewares = require('../middlewares');

//Create
router.get('/community/new',
    middlewares.isSignIn,
    Community.new
)

router.post('/community',
    middlewares.isSignIn,
    wrapAsync(Community.create)
)

//

module.exports = router