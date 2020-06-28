const _ = require('lodash')
const User = require("../models/user");
//const { inRange } = require('lodash');

exports.userById = (req, res, next, id) => {

    User.findById(id).exec((err, user) => {

        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        //adds profile object in the req with user info
         req.profile = user;
         next();

    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id

    if(!authorized) {
        return res.status(403).json({
            error: "User is not authorized to do this"
        });
    }
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({users})

    }).select("name email updated created");
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
     return res.json(req.profile);

};

exports.updateUser = (req, res, next) => {
    let user = req.profile
    //extend user object, 
    user = _.extend(user, req.body)
    //update the user
    user.update = Date.now()
    //save user in the database
    user.save((err) => {
        if(err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action"
            });
        }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({user});

    });
};

//remove user
exports.deleteUser = (req, res, next) => {
    let user = req.profile
    //extend user object, 
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({
                error: err
            });

 }
    
    
    res.json({message: "User deleted successfully"});

    });
};