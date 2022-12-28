const router = require('express').Router()
const Post =require ('../modal/post')
const postController =require('../controller/post')
const multer =require('../multer')
const verify = require('../tokenValidaton')




router.post('/addpost',verify,multer.upload.single("img"),postController.addPost)

router.get('/getpost',verify,postController.getPost)

router.get('/getfeeds',verify,postController.getfeeds)

router.post('/doLike',verify,postController.doLike)  
 
router.post('/doDislike',verify,postController.doDislike)
  
router.post('/doComment',verify,postController.doComment)

router.get('/getComment',verify,postController.getComment)

router.post('/blockpost',verify,postController.blockpost)

router.get('/getreportedPost',postController.getreportedPost)

router.get('/BlockAndUnblockPost',postController.BlockAndUnblockPost)

router.get('/getPostInfoDetails',postController.getPostInfoDetails)

router.get('/getLikedPeople',postController.getLikedPeople)

router.post('/notification',postController.notification)



module.exports = router