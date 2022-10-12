const jwt = require("jsonwebtoken");
const passport = require('passport');
require('dotenv').config({path: "../config/.env"});

exports.create = function (req, res) {
    passport.authenticate('local', {session:false}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                msg: "error",
                user: user
            })
        }
        req.login(user, {session:false}, err => {
            if(err){ res.send(err) };

            const token = jwt.sigh(user.toJSON(), process.env.JWT_SECRET);
            return res.json((user, token));
        })
    }) (req, res);
};