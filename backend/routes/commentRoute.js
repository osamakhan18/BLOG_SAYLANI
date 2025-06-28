const express = require('express')
const app = express()
const router = express.Router()

const verifyToken = require('../verifyToken')
const {createComment,getCommentsByPost,editComment,deleteComment,getCommentById,getCommentsByUser } = require('../controller/commentController')
// const {getCommentsByPost} = require('../controller/commentController')

router.post('/createComment/:postId', verifyToken, createComment)
router.get('/getCommentsByPost/:postId', verifyToken, getCommentsByPost);

router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getCommentById/:commentId',verifyToken,getCommentById)
router.get('/getCommentsByUser/:userId', verifyToken, getCommentsByUser);







 
module.exports = router