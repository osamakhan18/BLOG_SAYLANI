const express = require('express')
const app = express()
const router = express.Router()

const {newPost,getallPost,getPostById,getPostByAuthor,updatePost,deletePost} = require('../controller/postController')
const verifyToken = require('../verifyToken')

router.post('/newPost',verifyToken,newPost)
router.get('/getAllPosts', verifyToken, getallPost)
router.get('/getPostByID/:id', getPostById)
router.get('/getPostByAuthor/:id',getPostByAuthor)
router.put('/updatePost/:id', verifyToken,updatePost)
router.delete('/deletePost/:id' ,verifyToken,deletePost)





module.exports= router