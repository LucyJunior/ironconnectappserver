const express = require('express');
const { getPosts, createPost, postsByUser, postById } = require('../controllers/posts');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/', getPosts);
//to create a new post the user must be signedin
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);

router.post("/posts/by/:userId", postsByUser);


// any route containing :userId, the app will first execute userByID()
router.param('userId', userById);


// any route containing :postId, the app will first execute postById()
router.param('postId', postById);

module.exports = router;