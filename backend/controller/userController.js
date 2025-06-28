const User = require('../model/User')
const Post = require('../model/Post')
const mongoose = require('mongoose') // Added missing import

// view profile 
exports.getProfile = async (req,res)=>{
  try{
    const user = await User.findById(req.user.id).select('-password')
    
    if(!user){
      return res.status(404).json({message:"cannot found user"}) // Added return and fixed status
    }
    res.status(200).json(user) // Fixed status code

  }catch(err){
    console.log(`error occur on the view profile ${err}`)
    res.status(500).json({message:"Server error"})
  }
}

exports.updateProfile = async (req,res) =>{
  const {email,profile} = req.body

  try{
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { email, profile },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updateUser); // Fixed status code
  }catch(err){
    res.status(500).json({message:err.message}) // Fixed error handling
  }
}

// savePost 
exports.savePost = async (req, res) => {
  try {
    console.log('Attempting to save post:', req.params.id);
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ 
      success: false,
      message: "User not found" 
    });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({
      success: false, 
      message: `Post ${req.params.id} not found`,
      suggestion: "Verify the post exists in database"
    });

    // Initialize array if undefined and fix field name
    user.savedPosts = user.savedPosts || []; 

    if (user.savedPosts.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Post already saved",
        savedPosts: user.savedPosts
      });
    }

    user.savedPosts.push(req.params.id); // Fixed field name
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post saved successfully",
      savedPosts: user.savedPosts
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// get the save post
exports.getSavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedPosts'); // Fixed field name
    
    if (!user) {
      return res.status(404).json({ message: "cannot found the user" });
    }

    // Use the correct field name
    const postIds = user.savedPosts || [];

    const savedPosts = await Post.find({
      _id: { $in: postIds }
    }).populate('author', 'username profile');

    res.status(200).json(savedPosts);
    console.log('User savedPosts:', user.savedPosts);
    console.log('Found posts:', savedPosts);

  } catch (error) {
    res.status(500).json({ message: `cannot get the post ${error.message}` });
  }
};

// remove the savePost
exports.removePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postId = req.params.id;
    
    if (!user.savedPosts || !user.savedPosts.includes(postId)) { // Fixed field name
      return res.status(404).json({ message: "Post not found in saved posts" });
    }

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId); // Fixed field name
    await user.save();
    
    res.status(200).json({ message: "Post removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error removing post", error: error.message });
  }
};
