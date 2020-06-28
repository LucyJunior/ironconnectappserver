const User = require("../models/user");

exports.userById = (req, res, next, id) => {

    User.findById(id).exec((err, user) => {

        if(err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        //adds profile object in the req with user info
         req.profile = user
         next()

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

    });
}