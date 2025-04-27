const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
require("dotenv").config()

exports.register = async (req,res)=>{
  try{
    const {username,email,password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const newUser = new User({username,email,password:hashedPassword })
    const saved = await newUser.save()
    res.status(201).json({message:"user register successfully ",user:saved})

  }catch(error){
    console.log(error)
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password); // fix here: compare(password, user.password)

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY
    );

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req,res)=>{
  try{
    res.clearCookie("token")
    res.status(201).json({message:"logout successfully"})

  }catch(error){
    console.log(error)
  }
 
}

