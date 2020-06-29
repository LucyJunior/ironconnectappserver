const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    //user info from the user model
    .populate("postedBy", "_id name")
    .exec((err, post) => {
        if(err || !post) {
            return res.status($00).json({
                error:err
            });
        }
        req.post = post
        next()
    });

};


exports.getPosts = (req, res) => {
            const posts = Post.find()
            .populate("postedBy", "_id name")
            .select("_id title body")
            .then(posts => {
                res.json({posts});
            })
            .catch(err => console.log(err));
     
};


exports.createPost = (req, res, next) => {
    //incoming method with the package
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files ) => {
        if(err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        //post with all the fields that are coming from the request
        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        //assign post to a user
        post.postedBy = req.profile;
        if(files.photo) {

            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            //respond with the post
            res.json(result)
        });

    });
};

exports.postsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    //populae because is on a different model and you want a specific info
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(post);

    });
};


exports.isPoster = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        //first argument source object, second from the request body
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

exports.deletePost = (req, res) => {
    //first we get a post
    let post = req.post;
    //remove method
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully'
        });
    });
};