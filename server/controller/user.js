const bcrypt = require('bcrypt')
const User = require('../modal/user')
const Post = require('../modal/post')
// var jwt = require('jsonwebtoken');
// const { response } = require('express');
const UserOTPVerification = require('../modal/userVerifiacation')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const Notification = require('../modal/notification')
const { notification } = require('./post')
let ObjectId = mongoose.Types.ObjectId


let OtpforgetExpireDate
let forgotOTP = {}
let userSerch = {}


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "testmail.mailer721@gmail.com", // generated ethereal user
        pass: "darkhmwiqrnjemsf", // generated ethereal password
    },
});

const sentOTPverificationmail = async (result, res) => {
    console.log("result._id");
    console.log(result);
    try {
        const otp = `${Math.floor(100 + Math.random() * 9000)}`

        const mailOptions = {
            form: 'testmail.mailer721@gmail.com',
            to: result.email,
            subject: "verify your email",
            html: `<p>Enter <b> ${otp}  </b> in the app to verify your emial address</p>`
        }

        let hashOTP = await bcrypt.hash(otp, 10)
        let verify = await UserOTPVerification.findOne({ userId: result._id })
        if (!verify) {
            const userverification = new UserOTPVerification({
                userId: result._id,
                otp: hashOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 10000
            })
            await userverification.save()
        } else {
            await UserOTPVerification.updateOne({ userId: result._id }, { otp: hashOTP })
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("errr");
                console.log(error);
            } else {
                console.log("Verification otp mail sent");
                console.log(info.response);
                res.json({
                    status: "pending",
                    message: "Verification otp mail sent",
                    mail: result.email,
                    user: result
                })
            }
        });
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message,
        })
    }
}

const sentForgotOtp = async (data, res) => {
    console.log("data");
    console.log(data);
    forgotOTP = data

    try {
        const otp = `${Math.floor(100 + Math.random() * 9000)}`
        forgotOTP.otp = otp
        OtpforgetExpireDate = Date.now() + 300000
        const mailOptions = {
            form: 'testmail.mailer721@gmail.com',
            to: data.email,
            subject: "verify your email",
            html: `<p>Enter <b> ${otp}  </b> in the app to verify your emial address</p>`
        }
        // console.log(result._id);
        console.log("mail send");
        console.log(data.email);
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("errr");
                console.log(error);
            } else {
                console.log("Forgot Password otp mail sent");
                console.log(info.response);
                res.json({
                    message: "Verification otp mail sent",
                    mail: data.email,


                })
            }
        });
    } catch (error) {
        console.log("err");
        console.log(error);
        res.json({
            status: "Failed",
            message: error.message,
        })
    }
}

module.exports = {

    home: (req, res) => {
        console.log("////;");
        res.json({ auth: true, message: "dfghjk" })
    },

    verify: (req, res) => {
        console.log("verify;");
        res.json({ auth: true, message: "dfghjk" })
    },

    signup: async (req, res) => {
        console.log(req.body);
        try {
            let user = await User.findOne({ email: req.body.email })
            let username = await User.findOne({ username: req.body.username })
            console.log("fghjkl;'");
            console.log(username);
            if (username) {
                console.log("user");
                res.json({ message: "Username already used " })
            }
            if (user && user.verified == true) {
                console.log("user tru");
                console.log("user Exixt");
                res.status(200).json({ message: "Please enter unique email" })

            } else {
                console.log("user fls");
                if (user) {
                    sentOTPverificationmail(user, res)
                } else {
                    let hashPassword = await bcrypt.hash(req.body.password, 10)
                    console.log(hashPassword);
                    if (hashPassword) {
                        console.log("inside 1 st");
                        const newuser = new User({
                            first_name: req.body.first_name,
                            username: req.body.username,
                            email: req.body.email,
                            phone: req.body.phone,
                            password: hashPassword,
                            verified: false
                        })
                        newuser.save().then((result) => {
                            console.log("result");
                            console.log(result);
                            sentOTPverificationmail(result, res)
                        })
                    } else {
                        res.status(200).json({ message: "Password bcryp not done" })
                    }
                }
                // res.status(200).json({user:true})
            }

        } catch (error) {
            console.log(error);
        }
    },

    verifyOTP: async (req, res) => {
        console.log("verify");
        console.log(req.body);
        // console.log(time);
        let userOTP = req.body.userOtp.join('')
        const verifyOtp = await UserOTPVerification.findOne({ userId: req.body.user._id })
        console.log("verifyOtp");
        console.log(userOTP);
        hashOTP = verifyOtp.otp
        console.log(hashOTP);
        const otp = await bcrypt.compare(userOTP, hashOTP)
        console.log(otp);
        if (otp) {
            if (verifyOtp.expiresAt > verifyOtp.createdAt) {
                console.log("req.body");
                let user = await User.updateOne({ _id: verifyOtp.userId }, { verified: true })
                if (user) {

                    res.status(200).json({ message: "Success", user: req.body })
                } else {

                    res.status(200).json({ message: "OTP has been expired" })
                }

            } else {
                res.status(200).json({ message: "OTP has been expired" })
            }
        } else {
            res.status(200).json({ message: "Please enter valid OTP" })
        }
    },

    forgotPassword: async (req, res) => {
        console.log("forgot");
        console.log(req.query);
        let user = await User.findOne({ email: req.query.email })
        console.log(user);
        if (user) {
            if (user.verified == true) {
                // res.status(200).json({ message: "success",user:user })
                sentForgotOtp(user, res)
            } else {
                res.status(200).json({ message: "Please enter valid email" })
            }
        } else {
            console.log("not found");
            res.status(200).json({ message: "Please enter valid email" })
        }
    },

    verifyForgotPW: async (req, res) => {
        let userOTP = req.body.otp.join('')
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        if (userOTP === forgotOTP.otp) {
            if (OtpforgetExpireDate > Date.now()) {
                console.log("req.body");
                let UpdatedUser = await User.updateOne({ email: forgotOTP.email }, {
                    $set: { password: hashPassword }
                })
                if (UpdatedUser) {
                    console.log("result");
                    // console.log(result);
                    userData = ""
                    res.status(200).json({ message: "Success", user: true })

                }
            } else {
                res.status(200).json({ message: "OTP has been expired" })
            }
        } else {
            res.status(200).json({ message: "Please enter valid OTP" })
        }
    },

    getuserDetails: async (req, res) => {
        console.log(req.query);
        console.log("jasim");
        try {
            let userDetails = await User.findOne({ _id: ObjectId(req.query.user) })
            // console.log(userDetails)
            // console.log("userDetails")
            res.json(userDetails)
        } catch (error) {
            res.json(error)
        }
    },

    getAllUsers: async (req, res) => {

        try {
            let userDetails = await User.find({ $and: [{ followers: { $nin: req.query.user } }, { _id: { $ne: req.query.user } }] }).limit(4)

            res.json(userDetails)
        } catch (error) {
            res.json(error)
        }
    },

    search: async (req, res) => {
        console.log(req.query.user);
        var q = req.query.user
        let users = await User.find({ isBlock: false, username: { $regex: new RegExp(q, 'i') } })
        console.log(users);
        res.json(users)

    },

    editprofile: async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.file);
            let image
            let user = await User.findOne({ email: req.body.email })
            let Activeuser = await User.findOne({ _id: req.body.userId })
            let username = await User.findOne({ username: req.body.username })

            console.log("Activeuser");
            console.log(Activeuser);

            if (Activeuser.profile && req.file == undefined) {
                image = Activeuser.profile
                console.log("active filenull");
                console.log(image);
            } else if (!Activeuser.profile && req.file == undefined) {
                image = "null"
                console.log("! active filenull");
                console.log(image);
            } else {
                console.log("out of");
                image = req.file.filename
                console.log(image);
            }

            if (user && Activeuser.email != req.body.email) {
                console.log("Existing email id");
                res.json({ message: "Existing email id" })
            } else if (username && Activeuser.username != req.body.username) {
                console.log("Existing usrname");
                res.json({ message: "Existing usrname" })
            } else {
                console.log("asdfghjkl");
                await User.updateOne({ _id: req.body.userId }, {
                    $set: {
                        first_name: req.body.fullname,
                        username: req.body.username,
                        phone: req.body.phone,
                        email: req.body.email,
                        profile: image,
                    }
                })
                res.json({ message: "success", status: true })
            }

        } catch (error) {
            res.json({ message: error.message })
            console.log(error);
        }

    },

    updateCover: async (req, res) => {
        try {
            // console.log("xcvbnm");
            // console.log("setCover");
            // console.log(req.file);
            // console.log(req.file.filename);
            // console.log(req.body);
            await User.updateOne({ _id: req.body.userId }, {
                $set: {
                    cover: req.file.filename,
                }
            })
            res.json({ message: "success", status: true })
        } catch (error) {
            res.json({ message: error.message })
            console.log(error);
        }

    },

    getuserInfoDetails: async (req, res) => {
        try {
            // console.log("req.query.user");
            // console.log(req.query.user);
            let user = await User.findOne({ _id: ObjectId(req.query.user) })
            let userData = await Post.find({ userId: req.query.user, isBlock: false })
            // console.log("user fetch infooooooo");
            // console.log(userData);
            // console.log(user);
            res.json({ userData, user })
        } catch (error) {
            console.log(error);
        }
    },

    follow: async (req, res) => {
        console.log("users follow");
        console.log(req.body);
        try {
            await User.updateOne({ _id: req.body.userId },
                {
                    $push: { following: req.body.receiverId }
                })
            await User.updateOne({ _id: req.body.receiverId },
                {
                    $push: { followers: req.body.userId }
                }).then(() => {
                    res.json({ status: true })
                })

        } catch (error) {
            console.log(error);
            res.json(error)
        }
    },




    unfollow: async (req, res) => {
        console.log("users Unfollow");
        console.log(req.body);
        try {
            await User.updateOne({ _id: ObjectId(req.body.userId) },
                {
                    $pull: { following: req.body.receiverId }
                })
            await User.updateOne({ _id: req.body.receiverId },
                {
                    $pull: { followers: req.body.userId }
                }).then(() => {
                    res.json({ status: true })
                })

        } catch (error) {
            console.log(error);
            res.json(error)
        }
    },

    reportuser: async (req, res) => {
        console.log(req.body);
        try {
            let block = await User.findOne({ _id: ObjectId(req.body.userId) })
            if (block.reports.includes(req.body.myId)) {
                console.log("Exist");
                res.json({ status: true, message: 'Already reported user' })
            } else {
                console.log("new");
                console.log(req.body);
                await User.updateOne({ _id: ObjectId(req.body.userId) }, {

                    $push: { reports: req.body.myId }

                })
                res.json({ status: true, message: 'User report successfully' })
            }
        } catch (error) {
            console.log(error);
        }
    },

    getAlluser: async (req, res) => {
        try {
            console.log("sdfghjklcvbnm");
            console.log("post man");
            let user = await User.find({})
            res.json({ user })
        } catch (error) {
            console.log(error);
        }
    },


    PostBlockedUser: async (req, res) => {
        console.log("userrrrrrr");
        console.log(req.query.user);
        let users = await Post.aggregate([
            {
                $match: { _id: ObjectId(req.query.user) }
            },
            {
                $unwind: "$reports"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "reports",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },
            {
                $project: {
                    username: '$userinfo.username',
                    image: '$userinfo.profile',
                    isBlocked: '$userinfo.isBlocked'
                }
            }
        ])
        console.log(users);
        res.json(users)
    },

    BlockedUser: async (req, res) => {
        console.log(req.query.user);
        let users = await User.aggregate([
            {
                $match: { _id: ObjectId(req.query.user) }
            },
            {
                $unwind: "$reports"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "reports",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },
            {
                $project: {
                    username: '$userinfo.username',
                    image: '$userinfo.profile',
                    isBlocked: '$userinfo.isBlocked'
                }
            }
        ])
        console.log(users);
        res.json(users)

    },

    BlockAndUnblockUser: async (req, res) => {
        console.log("nnnnnn");
        await User.findOneAndUpdate(
            { _id: ObjectId(req.query.user) },
            [{ $set: { isBlock: { $eq: [false, "$isBlock"] } } }]
        )
    },


    getLiveUsers: async (req, res) => {
        // console.log("req.query.users.userId");
        // console.log(req.query.user);
        let liveusers = JSON.parse(req.query.liveusers)
        let aab = []

        liveusers?.map((item) => {
            aab?.push(item?.userId !== req.query?.user && item?.userId)
        })

        aab = aab.filter(item => item != null && item)

        // console.log("liveusers");
        // console.log(aab);

        try {
            let onlineUsers = await User.find({ _id: { "$in": aab } })
            //    console.log(onlineUsers);
            //    console.log("onlineUsers");
            res.json(onlineUsers)

            //    console.log(onlineUsers);
        } catch (error) {
            console.log(error);
        }

    },
    getNotification: async (req, res) => {
        try {
            console.log("req,body");
            console.log(req.query);
            Notification.aggregate([
                {
                    $match: { userId: ObjectId(req.query.user) },
                },
                {
                    $unwind: "$notification"
                },

                {
                    $lookup: {
                        from: 'users',
                        localField: "notification.userId",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: "notification.postId",
                        foreignField: "_id",
                        as: "postinfo"
                    }
                },
                {
                    $project: {
                        username: '$userinfo.username',
                        userProfil: '$userinfo.profile',
                        post: '$postinfo.image',
                        type: '$notification.type',
                        date: '$notification.date',
                        status: '$notification.status',
                    }
                },
                {
                    $sort: { date: -1 }
                },
                { $limit: 10 }
            ]).then((response) => {
                res.json(response)
            })
        } catch (error) {
            res.json(error)
        }

    },

    readNotification: async(req, res) => {
        console.log(req.query.user);
        console.log("read notifiication");
        try {
            let dat = await Notification.updateOne({ userId: ObjectId(req.query.user) },
            { "$set": { "notification.$[].status": false }}
            )
        } catch (error) {
            console.log(error);
        }
    },

    // removeNotification:async(req,res)=>{
    //     console.log("req.query.user ghjdskndksm");
    //     console.log("req.query.user");
    //     console.log(req.query.user);
    //     // var newN = await Notification.find({ userId:ObjectId(req.query.user) },{ notification: { $slice: 1 } })
    //     // console.log(newN);
    //     Notification.updateMany(
    //         {userId:ObjectId(req.query.user)},
    //         { $slice: { notification: 1 } }
    //     )
    // } 

    getFollowers: (req, res) => {
        try {

            console.log(req.query.users);
            User.find({ _id: req.query.users }).populate('following').populate('followers').then((response) => {
                //    console.log(response[0].following[0]);
                res.json(response)
            })

        } catch (error) {
            console.log(error);
        }


    }
}   