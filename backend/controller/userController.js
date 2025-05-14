const User = require('../model/User')
const Post = require('../model/Post')


// view profile 

exports.getProfile = async (req,res)=>{

 try{
  const user = await User.findById(req.user.id).select('-password')
  
  if(!user){
    res.status(400).json({message:"cannot found it "})

  }
  res.status(201).json(user)


 }catch(err){
  console.log(`error occur on the view profile ${err}`)
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
    
    res.status(201).json(updateUser);
    

  }catch(err){
    res.status(404).json({message:err})
  }
}


// savePost 
exports.savePost = async (req, res) => {
  try {
    // Debugging
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

    // Initialize array if undefined
    user.savePost = user.savePost || []; 

    if (user.savePost.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Post already saved",
        savedPosts: user.savePost
      });
    }

    user.savePost.push(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post saved successfully",
      savedPosts: user.savePost
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
    const user = await User.findById(req.user.id).select('savePost'); // Added .select('savePost')
    
    if (!user) {
      return res.status(404).json({ message: "cannot found the user" });
    }

    // Convert to ObjectId if needed
    const postIds = user.savePost ? user.savePost.map(id => mongoose.Types.ObjectId(id)) : [];

    const savedPosts = await Post.find({

      _id: { $in: postIds } // Use converted IDs
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
    
    if (!user.savePosts || !user.savePosts.includes(postId)) {
      return res.status(404).json({ message: "Post not found in saved posts" });
    }

    user.savePosts = user.savePosts.filter(id => id.toString() !== postId);
    await user.save();
    
    res.status(200).json({ message: "Post removed successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error removing post", error: error.message });
  }
};