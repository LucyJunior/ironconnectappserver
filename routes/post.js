const express = require('express');
const { getPosts, createPost, postsByUser } = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/', getPosts);
//to create a new post the user must be signedin
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);

router.post('/posts/by/:userId', requireSignin, postsByUser);


// any route containing :userId, the app will first execute userByID()
router.param('userId', userById);

module.exports = router;