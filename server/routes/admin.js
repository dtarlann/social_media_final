const router=require('express').Router()
const adminControler =require('../controller/admin')


router.post('/register',adminControler.register)

router.post('/login',adminControler.login)


module.exports=router