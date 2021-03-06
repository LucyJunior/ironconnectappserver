//signup/signin/signout

const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

//define the function with async
//async= we wait for certain data to come to us
exports.signup = async (req, res) => {

    const userExists = await User.findOne({email: req.body.email});
    
    if(userExists) return res.status(403).json({
        error: "Email is taken!"
    });

    const user = await new User(req.body)

    await user.save()
    res.status(200).json({ message: "Signup success! Please login." });

};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            });
        }
        // generate a token with user id and secret
        //using jwt package, generating a cookie based the user id and the secret in jwt file
        //generating a cookie
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        console.log(token)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 99999 });
        // return response with user and token to frontend client
    
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};


exports.signout = (req, res) => {
    //clear the cookie with the name
    res.clearCookie("t")
    return res.json({message: "We hope to see you again :("})
}

exports.requireSignin = expressJwt ({

    //if token valid, express jwt appends the verified users id in an auth key to request object

    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});