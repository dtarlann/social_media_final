const Conversation = require('../modal/conversation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    conversaton: async (req, res) => {
        console.log(req.body);
        let conversaton = await Conversation.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } })
        console.log(conversaton);
        if (conversaton == null) {
            const newConversation = new Conversation({
                members: [req.body.senderId, req.body.receiverId],
            })

            try {
                const savedConversation = await newConversation.save()
                res.status(200).json(savedConversation)
            } catch (error) {
                res.status(500).json(error)
            }
        } else {
            res.status(200).json(conversaton)

        }

    },
    getConversaton: async (req, res) => {
        try {
            const conversation = await Conversation.find({
                members: { $in: [req.params.userId] }
            })
            res.status(200).json(conversation)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}