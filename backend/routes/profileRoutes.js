const express = require('express');
const router = express.Router();

const verifyToken = require('../verifyToken');
const { getProfile,updateProfile,savePost,getSavePost,removePost} = require('../controller/userController');

// Profile route with token verification
router.get('/profile', verifyToken, getProfile);
router.put('/update',verifyToken,updateProfile)
router.post('/savePost/:id', verifyToken, savePost);
router.get('/getSavePost',verifyToken,getSavePost)
router.delete('/removePost/:id', verifyToken, removePost);




module.exports = router;
