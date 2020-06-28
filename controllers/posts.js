const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');

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