const Message = require('../modal/message')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
let ObjectId = mongoose.Types.ObjectId

module.exports={

    message:async(req,res)=>{
        const newMessage = new Message(req.body)

        try {
            const savemessage =await newMessage.save()
            res.status(200).json(savemessage)
            
        } catch (error) {
            res.status(500).json(error) 
        }
    },
    getMessage:async(req,res)=>{
        try {
            console.log("req.params.conversationId");
            console.log(req.params.conversationId);
            const messages = await Message.find({
                // _id:ObjectId(req.params.conversationId)
                conversationId:req.params.conversationId
            })
            console.log(messages);
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json(error) 
        }
    }
}