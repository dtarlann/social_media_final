const router=require('express').Router()
const conversationControler =require('../controller/conversation')
const verify = require('../tokenValidaton')

router.post('/',verify,conversationControler.conversaton)

router.get('/:userId',verify,conversationControler.getConversaton)

module.exports=router