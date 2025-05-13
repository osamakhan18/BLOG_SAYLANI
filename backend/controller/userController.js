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


