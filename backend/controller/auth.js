// controller/auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Keep this as jwt to match your existing code
const User = require('../model/User');
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    
    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({username, email, password: hashedPassword});
    const saved = await newUser.save();
    return res.status(201).json({message: "user register successfully", user: saved});
  } catch(error) {
    console.log(error);
    // Send error response to client
    return res.status(500).json({message: "Registration failed", error: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.password) {
      return res.status(500).json({ message: "User has no password set in the database" });
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.SECRET_KEY
    );
    
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({message: "logout successfully"});
  } catch(error) {
    console.log(error);
    return res.status(500).json({message: "Logout failed"});
  }
};