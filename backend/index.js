// index.js
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Add this dependency
const app = express();

const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true

}))

const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoutes');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute')

// Add cookie parser middleware
app.use(cookieParser());

// Parse JSON requests
app.use(express.json({
  limit: '100mb'
}));


// Routes
app.use('/api', authRoute);
app.use('/user', profileRoute);
app.use('/post', postRoute);
app.use('/comment',commentRoute)


const port = process.env.PORT || 7000;
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb is connected successfully");
  } catch(error) {
    console.log(error);
  }
};

// Connect to database before starting server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`the server is running on the port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});






// {
//     "title": "Top 5 Hidden Gems in Bali",
//     "tags": [
//         "travel",
//         "indonesia",
//         "adventure"
//     ],
//     "author": "68216a3970c708fe098b386e",
//     "likes": [],
//     "_id": "6822ef3915b2af246240bd96",
//     "createdAt": "2025-05-13T07:05:29.452Z",
//     "__v": 0
// }


// {
//     "title": "Easy Homemade Sourdough Recipe",
//     "tags": [
//         "baking",
//         "recipes",
//         "bread"
//     ],
//     "author": "68216a3970c708fe098b386e",
//     "likes": [],
//     "_id": "6822ef5bd8e7dff13e0b0f27",
//     "createdAt": "2025-05-13T07:06:03.805Z",
//     "__v": 0
// }