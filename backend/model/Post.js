const express = require('express')
const app = express()
const mongoose = require('mongoose')

const postSchema = new  mongoose.Schema({
  id:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  tags:{
    type:[String],
  default:[]
  },
author:{
    type:mongoose.Schema.Type.ObjectyId,
   ref:'user',
  },
  likes:[{
      type:mongoose.Schema.Types.ObjectId, // --> it only store the id not the whole collection
    ref:"user" //--> from the user collection
  }],
  createdAt:{
    type:Date,
    default:Date.now 
  }
})

module.exports = mongoose.model("Post",postSchema)

