const mongoose =require ('mongoose')


const postSchema = new mongoose.Schema({
discription:{
    type:String
},
image:{
    require:true,
    type:String
},
userId:{
    require:true,
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
like:{
type:[mongoose.Schema.Types.ObjectId]
},
isBlock: {
    type: Boolean,
    default:false
},
comment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'comment'
},
reports:{
    type:[mongoose.Schema.Types.ObjectId]
}
},{timestamps: true})

const post = mongoose.model('post',postSchema)
module.exports =post