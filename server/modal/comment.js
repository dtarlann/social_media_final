const mongoose = require('mongoose')

let commentDataSchema = new mongoose.Schema({
    message:{
        type:String,
        require:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'user'
    },
    like:{
        type:Array
    },
    date:{
        type: Date,
    default: Date.now,
    required:true
}
})

const commentSchema = new mongoose.Schema({
    postId:{
        require:true,
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment:[commentDataSchema]

},{timestamps: true})

const comment =mongoose.model('comment',commentSchema)
module.exports =comment