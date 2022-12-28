const multer = require('../multer')
const Post = require('../modal/post')
const User = require('../modal/user')
const Comment = require('../modal/comment')
const mongoose = require('mongoose')
const comment = require('../modal/comment')
const Notification = require('../modal/notification')
let ObjectId = mongoose.Types.ObjectId
module.exports = {

    addPost: async (req, res) => {
        try {
            console.log("post add");
            console.log(req.body);
            console.log(req.file);
            console.log("req.body.userId");
            console.log(req.body.userId);
            console.log(req.body.discription);
            console.log(req.file.filename);
            await new Post({
                discription: req.body?.discription,
                userId: req.body.userId,
                image: req.file?.filename
            }).save()
            console.log("success");
            res.status(200).send({ post: true });
        } catch (error) {
            console.log("fvgbhjkl;");
            console.log(error);
            res.send({ auth:false,"message": error.message })
        }



    },

    getPost: async (req, res) => {
        try {
            console.log(req.query);
            user = req.query.user
            console.log(user);
            let posts = await Post.find({ userId: ObjectId(user) })
            res.status(200).json(posts)
        } catch (error) {
            console.log(error);
        }
    },

    getfeeds: async (req, res) => {
        try {
            console.log("all posts");
            console.log(req.query.user);
            let user = req.query.user
            console.log(user);
            // console.log(following);
            // let post = await Post.find({}).populate('userId').sort({ createdAt: -1 })
            // let userinfo =await User.find({_id:ObjectId(user)})
            let post = await User.aggregate([
                {
                    $match: { _id: ObjectId(user) }
                },
                {
                    $unwind: "$following"
                },

                {
                    $lookup:
                    {
                        from: 'posts',
                        localField: 'following',
                        foreignField: 'userId',
                        as: 'feed'
                    }
                },
                {
                    $unwind: "$feed"
                },
                {
                    $match: { 'feed.isBlock': false }
                },
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'feed.userId',
                        foreignField: '_id',
                        as: 'userdt'
                    }
                },
                {
                    $project: {
                        username: "$userdt.username",
                        profile: "$userdt.profile",
                        like: "$feed.like",
                        comment: "$feed.comment",
                        image: "$feed.image",
                        discription: "$feed.discription",
                        date: "$feed.createdAt",
                        feedId: "$feed._id",
                        isBlock: "$feed.isBlock",
                        postUserId:"$userdt._id"
                    }
                },
                {
                    $sort: { date: -1 }
                }
                // {
                //     $lookup: 
                //     {
                //         from:'users',
                //         localField:'feed.userId',
                //         foreignField:'_id',
                //         as: 'user'
                //     }
                // },
                // {
                //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$feed", 0 ] }, "$$ROOT" ] } }
                //  },
                //  { $project: { feed: 1 } }


            ])
           
            res.status(200).json({ post })
        } catch (error) {
            console.log("error");
            console.log(error);
        }

    },
    doLike:  (req, res) => {
        console.log("req.body");
        console.log(req.body);
        try {
            Post.updateOne({ _id: req.body.postId }, {
                $push: { like: req.body.userId }
            }).then(()=>{ 
                res.json({status:true, message: "Success" })
            })
        } catch (error) {  
            res.json({ message: error.message })
        }
    },
    doDislike: async (req, res) => {
        try {
            await Post.updateOne({ _id: req.body.postId }, {
                $pull: { like: req.body.userId }
            })
            console.log(post);
        } catch (error) {
            res.json({ message: error.message })
        }
    },

    doComment: async (req, res) => { 
        console.log('req.body'); 
        console.log(req.body);
        console.log('req.body');


        Comment.find({ postId: ObjectId(req.body.postId) }).then(async (response) => {
            console.log("response");
            console.log(response);
            if (response.length > 0) {
                console.log("exixt");
                Comment.updateOne({ postId: ObjectId(req.body.postId) }, {
                    $push: {
                        comment: {
                            message: req.body.comment,
                            userId: ObjectId(req.body.userId)
                        }
                    }
                }).then(()=>{
                    res.json({ status: true, message: "Comment added Successfully" })
                })
            } else {
                console.log("new");
                new Comment({
                    postId: ObjectId(req.body.postId),
                    comment: {
                        message: req.body.comment,
                        userId: ObjectId(req.body.userId)
                    }
                }).save().then(async (response) => {
                   Post.updateOne({ _id: req.body.postId },
                        {
                            $set: {
                                comment: response._id
                            }
                        }).then(()=>{
                            res.json({ status: true, message: "Comment added Successfully" })
                        })
                }) 
                res.json({ status: true, message: "Comment added Successfully" })
            }
        }).catch((err) => {
            console.log("err");
            console.log(err);
            res.json({ message: err })
        })

    },
 
    getComment: async (req, res) => {
        console.log("req.query"); 
        console.log(req.query.postId);
        // let comment = await Comment.find({postId:req.query.postId})
        // console.log(comment);
        // res.json({status:true,comment:comment})

        await Comment.aggregate([
            {
                $match: { postId: ObjectId(req.query.postId) }
            },
            { $unwind: "$comment" },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'comment.userId',
                    foreignField: '_id',
                    as: "user"
                }
            },

            {
                $project: {
                    username: '$user.username',
                    profile: '$user.profile',
                    comment: '$comment.message',
                    postId: '$postId',
                    date: '$comment.date',
                }
            },
            {
                $sort: { date: -1 }
            }


        ]).then((response) => {
            console.log(response);
            res.json({ status: true, comment: response })
        })
    },

    blockpost: async (req, res) => {
        try {
            let block = await Post.findOne({ _id: ObjectId(req.body.postId) })
            if (block.reports.includes(req.body.user)) {
                console.log("Exist");
                res.json({ status: true, message: 'Already reported post' })
            } else {
                console.log("new");
                console.log(req.body);
                await Post.updateOne({ _id: ObjectId(req.body.postId) }, {

                    $push: { reports: req.body.user }

                })
                res.json({ status: true, message: 'Post report successfully' })
            }
        } catch (error) {
            console.log(error);
        }
    },

    getreportedPost: async (req, res) => {
        console.log("sdfghjkcvbnm,");
        let post = await Post.find({ "reports.0": { "$exists": true } }).populate('userId')
        console.log(post);
        res.json(post)
    },

    BlockAndUnblockPost: async (req, res) => {
        console.log("qwertyui");
        console.log(req.query.user);
        await Post.findOneAndUpdate(
            { _id: ObjectId(req.query.user) },
            [{ $set: { isBlock: { $eq: [false, "$isBlock"] } } }]
        )
    },

    getPostInfoDetails: async (req, res) => {
        console.log("getPostInfoDetails");
        try {

           await Post.aggregate([
                {
                    $match:{_id: ObjectId(req.query.user) }
                },
                {
                    $lookup:{
                        from: 'comments',
                        localField: "_id",
                        foreignField: "postId",
                        as: "comment"
                    }
                },
                {
                    $lookup:{
                        from: 'users',
                        localField: "userId",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                { 
                    $project:{
                        name:'$userinfo.username',
                        Userprofile:'$userinfo.profile',
                        UserId:'$userinfo._id',
                        discription:1,
                        image:1,
                        like:1,
                        createdAt:1, 
                        comments:'$comment.comment'
                    }
                },  
               
            ]).then((response)=>{
                console.log("post");
                console.log(response);
                res.status(200).json({"message":"success" ,response})
            })
        } catch (error) {
            console.log(error); 
        }

    },


    getLikedPeople:(req,res)=>{
        
        try {
           Post.aggregate([
            {
                $match:{_id: ObjectId(req.query.postId) }
            },
            {
                $unwind:'$like'
            },
            {
                $lookup:{
                    from: 'users',
                    localField: "like",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },
            {
                $project:{
                    name:'$userinfo.username',
                    profile:'$userinfo.profile'
                }
            }
           ]).then((response)=>{
            console.log(response);
            res.json(response)
           })
        } catch (error) {
            console.log(error);
        }
    },
 
    notification:(req,res)=>{
        console.log(req.body);
        console.log("notification");
        Notification.find({userId: ObjectId(req.body.receiverId) }).then(async (response) => {
            if (response.length > 0) {
                Notification.updateOne({userId: ObjectId(req.body.receiverId)}, {
                    $push: {
                        notification: {
                            type: req.body.type,
                            userId: ObjectId(req.body.userId),
                            postId: ObjectId(req.body.postId),
                            status:true,
                        }
                    }   
                }).then(()=>{
                    res.json({ status: true, message: "Notificatoin added susseccfully" })
                })  
            } else { 
                console.log("new");
                await new Notification({  
                    userId: ObjectId(req.body.receiverId),
                    notification: { 
                        type: req.body.type,
                        userId: ObjectId(req.body.userId),
                        postId: ObjectId(req.body.postId),
                        status:true,
                    }
                }).save().then(async (response) => {
                res.json({ status: true, message: "Notificatoin added susseccfully" })
                }) 
                // res.json({ status: true, message: "Notificatoin added susseccfully" })
            }
        }).catch((err) => {
            console.log("err");
            console.log(err); 
            res.json({ message: err })
        })
    },
    
}