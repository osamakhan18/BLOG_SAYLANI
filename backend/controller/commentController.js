const mongoose = require('mongoose')
const Comment = require('../model/Comment')
const Post = require('../model/Post')
const User = require('../model/User')

// create the new comment 
exports.createComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "cannot find the post" });
    }

    const newComment = new Comment({
      content,
      post: postId,
      author: req.user.id
    });

    const savedComment = await newComment.save();
    const comment = await Comment.findById(savedComment._id).populate('author', 'username profile');

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: `error occur ${error}` });
  }
};

// get all comment 
exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Fixed variable name consistency

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Cannot find the post" });
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profile');

    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// edit comment
exports.editComment = async(req,res) =>{
  try{
    const {content}= req.body
    const commentId = req.params.commentId // Removed unnecessary await
    const comment = await Comment.findById(commentId)
    if(!comment){
      return res.status(404).json({message:"cannot found the comment"})
    }

    if(comment.author.toString() !== req.user.id){
       return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }
    comment.content = content;
    comment.updatedAt = Date.now()
    const updatedComment = await comment.save();
    await updatedComment.populate('author', 'username profile') // Fixed populate

    res.status(200).json(updatedComment)
  }catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// delete comment 
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author or an admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await comment.deleteOne();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    
    const comment = await Comment.findById(commentId)
      .populate('author', 'username profile');
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    if (error instanceof mongoose.CastError) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments by a specific user
exports.getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const comments = await Comment.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('post', 'title')
      .populate('author', 'username profile');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};