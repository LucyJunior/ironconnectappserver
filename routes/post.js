const express = require('express');
const { getPosts, createPost } = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/', getPosts);
//to create a new post the user must be signedin
router.post("/post", requireSignin, createPostValidator, createPost);


// any route containing :userId, the app will first execute userByID()
router.param('userId', userById);

module.exports = router;