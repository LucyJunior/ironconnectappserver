const express = require('express');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost, photo, singlePost } = require('../controllers/posts');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/posts', getPosts);
//to create a new post the user must be signedin
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);

router.get("/posts/by/:userId", singlePost );
router.get("/posts/:postId", requireSignin, postsByUser );
router.put("/post/:postId",requireSignin, isPoster, updatePost);
router.delete("/post/:postId",requireSignin, isPoster, deletePost);

//pic
router.get("/post/photo/:postId", photo);


// any route containing :userId, the app will first execute userByID()
router.param('userId', userById);


// any route containing :postId, the app will first execute postById()
router.param('postId', postById);

module.exports = router;