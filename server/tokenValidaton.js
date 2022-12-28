const router = require('express').Router()
const User = require('./modal/user')
const jwt_decode = require('jwt-decode')
var jwt = require('jsonwebtoken');
const verify = (req, res, next) => {  
    const token = req.headers['access-token']
    let decodeToken = jwt_decode(token)
    User.findOne({ _id: decodeToken.id }).then((response) => {
        if (!token) {
            console.log("aa");
            res.json({ auth: false, message: "We need a token, please give it to us next time" });
        } else if (response?.isBlock == true) {
            console.log("aa");
            res.json({ auth: false, message: "Your account has been blocked" });
        }
        else {
            jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
                if (err) {
                    res.json({ auth: false, message: "you are failed to authenticate" });
                } else {
                    // console.log("yeee");
                    next();
                }
            })
        }

    })
}

module.exports = verify;