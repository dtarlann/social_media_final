const router=require('express').Router()
const messageController =require('../controller/message')
const verify = require('../tokenValidaton')

router.post('/',verify,messageController.message)

router.get('/:conversationId',verify,messageController.getMessage)

module.exports=router