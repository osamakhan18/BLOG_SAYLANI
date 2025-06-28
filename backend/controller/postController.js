const express = require('express')
const app = express()
const Post = require('../model/Post')
const User = require('../model/User')

// new post 
exports.newPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      tags: tags || [],
      author: req.user.id
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Post creation failed', error: err.message });
  }
}

// get all posts 
exports.getallPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username profile');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// get the post by id
exports.getPostById = async (req,res) =>{
  try{
    const getpost = await Post.findById(req.params.id)
      .populate('author','username profile')
      .populate('likes','username profile')
    
    if (!getpost) {
      return res.status(404).json({message:"cannot find the post"});
    }
    
    res.status(200).json(getpost)
  }catch(error){
    res.status(404).json({message:"cannot find the id "})
  }
}

// get post by author
exports.getPostByAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    console.log("Searching for author:", authorId);

    const authorPosts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profile');

    console.log("Found posts:", authorPosts);
    res.status(200).json(authorPosts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

// update the post 
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Cannot find the post" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Cannot update the post", error: error.message });
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Cannot find the post" });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ 
      message: "Cannot delete the post",
      error: error.message
    });
  }
};

// search the post 
exports.searchPost = async (req,res)=>{
  try{
    const {keyword,tags}  = req.query
    const query = {}

    if(keyword){
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    }
    if(tags){
      const tagArray= tags.split(',').map(tag=>tag.trim())
      query.tags = {$in:tagArray}
    }

    const posts= await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "username profile")
      
    res.status(200).json(posts) // Fixed status code
  }catch(error){
    res.status(500).json({message:`cannot find the post ${error}`})
  }
}

// like the post 
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Cannot find the post" });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(200).json({ message: "Post is already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();
    return res.status(200).json({ message: "Post is liked" }); // Fixed status code
  } catch (error) {
    return res.status(500).json({ message: `Error occurred: ${error}` });
  }
};

// unlike the post 
exports.unlikePost = async (req,res)=>{
  try{
    const post = await Post.findById(req.params.id)
    if(!post){
      return res.status(404).json({message:"cannot found the post"}) // Added return
    } 
    if(!post.likes.includes(req.user.id)){
      return res.status(404).json({message:"post is not liked"}) // Added return and fixed message
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user.id) // Fixed filter function
    await post.save()
    res.status(200).json({message:"post unliked successfully"})

  }catch(error){
    res.status(500).json({message:`error occur ${error}`})
  }
}