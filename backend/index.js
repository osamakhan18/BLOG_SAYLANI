const express = require('express')
const mongoose = require('mongoose')
const app = express()
const authRoute= require('./routes/authRoute')

app.use(express.json())

app.use('/api',authRoute)









const port = 7000
require('dotenv').config();

const connectDB = async ()=>{
  try{
  await mongoose.connect(process.env.MONGO_URL)
  console.log("mongodb is connected successfully")


  }catch(error){
    console.log(error)

  }
}

connectDB()

app.listen(port,()=>{
  console.log(`the server is running on the port ${port}`)
  })
