const express = require('express')
const app = express()
const Post = require('../model/Post')
const User = require('../model/User')

exports.newPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      tags: tags || [],
      author: req.user.id // populated from verifyToken middleware
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
      .sort({ createdAt: -1 }) // Sort by creation time (newest first)
      .populate('author', 'username profile'); // Populate author with username and profile

    res.status(200).json(posts); // Status 200 for successful fetch
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message }); // Server error
  }
};

// get the post by id

exports.getPostById = async (req,res) =>{

  try{
    const getpost = await Post.findById(req.params.id)
  .populate('author','username profile')
  .populate('likes','username profile')
  res.status(200).json(getpost)

  }catch(error){
    res.status(404).json({message:"cannot find the id "})
  }
}

// get post by author

exports.getPostByAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    console.log("Searching for author:", authorId); // Debug log

    const authorPosts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate('author', 'username profile');

    console.log("Found posts:", authorPosts); // Debug log

    res.status(200).json(authorPosts);
  } catch (error) {
    console.error("Error:", error); // Debug log
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

// update the post 


exports.updatePost = async (req, res) => {
  const { title, content, tags } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Cannot find the post" });
  }

  if (post.author.toString() !== req.user.id) { // Changed from req.body.user
    return res.status(403).json({ message: "Unauthorized to update this post" }); // 403 Forbidden
  }

  post.title = title || post.title;
  post.content = content || post.content; // Fixed: was using title
  post.tags = tags || post.tags; // Fixed: was using title

  const updatedPost = await post.save(); // Added save()
  res.status(200).json(updatedPost);
};


// delete post
exports.deletePost = async (req, res) => {
  try {
    // 1. First find the actual post document
    const post = await Post.findById(req.params.id); // ✅ Add await and find
    
    if (!post) {
      return res.status(404).json({ message: "Cannot find the post" });
    }

    // 2. Now check author (post is a full document)
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    // 3. Delete the post
    await post.deleteOne(); // or post.remove()
    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ 
      message: "Cannot delete the post",
      error: error.message // More detailed error
    });
  }
};


// search the post 


exports.searchPost = async (req,res)=>{

 try{
   const {keyword,tags}  = req.query
  const query = {}

  if(keyword){
  query.$or = [  // Proper assignment
  { title: { $regex: keyword, $options: 'i' } },
  { content: { $regex: keyword, $options: 'i' } }
]
  }
  if(tags){
    const tagArray= tags.split(',').map(tags=>tags.trim())
    query.tags = {$in:tagArray}
  }

  const posts= await Post.find(query)
    .sort({ createdAt: -1 })
    .populate("author", "username profile")
    
    res.status(201).json(posts)
 
 }catch(error){
  res.status(404).json({message:`cannot find the post ${error}`})
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
    return res.status(201).json({ message: "Post is liked" });
  } catch (error) {
    return res.status(500).json({ message: `Error occurred: ${error}` });
  }
};


// unlike the psot 

exports.unlikePost = async (req,res)=>{

 try{
   const post = await Post.findById(req.params.id)
  if(!post){
    res.status(404).json({message:"cannot found the post"})
  } 
 if(!post.likes.includes(req.user.id)){
  res.status(404).json({message:"cannot like the message"})
 }

 post.likes= post.likes.filter(id =>id.toString !==req.user.id)
 await post.save()
 res.status(200).json({message:"post unlike successfully"})

 }catch(error){
  res.status(404).json({message:`error occur ${error}`})
 }
}


