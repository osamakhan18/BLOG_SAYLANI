const mongoose = require('mongoose')
const express = require('express')
const app = express()


const commentSchema= new mongoose.Schema({
  id:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
    required:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  creeatedAt:{
    type:Date,
    default:Date.now
  }


})

module.exports=mongoose.model('Comment',commentSchema)
