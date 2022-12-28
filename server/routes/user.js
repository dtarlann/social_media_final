const router = require('express').Router()
var jwt = require('jsonwebtoken');
const userController = require('../controller/user')
const multer =require('../multer')
const verify = require('../tokenValidaton')

 
 

router.get('/', verify, userController.home)
 
router.get('/verify', verify, userController.verify,) 
 
router.post('/signUp', userController.signup)
    
router.post('/verifyOTP', userController.verifyOTP)

router.post('/forgotPassword', userController.forgotPassword)

router.post('/verifyForgotPWOTP', userController.verifyForgotPW)

router.get('/getuserDetails',verify, userController.getuserDetails)  

router.get('/getAllUsers',verify, userController.getAllUsers)   

router.get('/search',verify, userController.search)

router.post('/editprofile',verify,multer.upload.single("img"), userController.editprofile)

router.post('/updateCover',verify,multer.upload.single("img"), userController.updateCover)

router.get('/getuserInfoDetails',verify, userController.getuserInfoDetails)

router.post('/follow',verify, userController.follow)

router.post('/unfollow', verify,userController.unfollow)

router.post('/reportuser', userController.reportuser)

router.get('/getAlluser', userController.getAlluser)

router.get('/PostBlockedUser', userController.PostBlockedUser)

router.get('/BlockedUser', userController.BlockedUser)

router.get('/BlockAndUnblockUser', userController.BlockAndUnblockUser)

router.get('/getLiveUsers',verify, userController.getLiveUsers)

// router.get('/getReportedusers', userController.getReportedusers)
router.get('/getNotification',userController.getNotification)

router.get('/getFollowers',userController.getFollowers)

router.get('/readNotification',userController.readNotification)

// router.get('/removeNotification',userController.removeNotification)

 

module.exports = router