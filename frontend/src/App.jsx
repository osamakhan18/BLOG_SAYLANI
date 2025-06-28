import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import axios from 'axios';
import './App.css';
import Home from './components/common/pages/Home';
import Login from './components/common/pages/Login';
import Register from './components/common/pages/Register';
// import CreatPost from './components/common/pages/CreatePost'
import CreatePost from './components/common/pages/CreatePost';

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
    <Route path='/' element={<Home/>}></Route>


    <Route path='/login' element={<Login/>}></Route>
    <Route path='/register' element={<Register/>}></Route>
    <Route path='/post' element={<CreatePost/>}></Route>


  </Routes>
   
   </>
  );
}

export default App;
