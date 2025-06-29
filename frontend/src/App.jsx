import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import axios from 'axios';
import './App.css';
import Home from './components/common/pages/Home';
import Login from './components/common/pages/Login';
import Register from './components/common/pages/Register';
import CreatePost from './components/common/pages/CreatePost';
import PostDetails from './components/common/pages/PostDetails';
import Favourate from './components/common/pages/favourate';
import EditPost from './components/common/pages/EditPost';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    axios.get("http://localhost:7000/post/getAllPosts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setPosts(res.data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.response?.data?.message || 'Error fetching posts');
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar/>
      
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/post' element={<CreatePost/>} />
        <Route path='/post/:id' element={<PostDetails/>} />
        <Route path="/favourate" element={<Favourate />} />
        {/* ✅ FIXED: Added :id parameter for edit route */}
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </>
  );
}

export default App;