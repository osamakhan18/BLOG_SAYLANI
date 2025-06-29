import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ FIXED: Better auth header handling
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await axios.get('http://localhost:7000/post/getAllPosts', getAuthHeader());
  return res.data;
});

// Create new post
export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
  const res = await axios.post('http://localhost:7000/post/newPost', postData, getAuthHeader());
  return res.data;
});

// Edit post
export const editPost = createAsyncThunk('posts/editPost', async ({ id, updatedData }) => {
  const res = await axios.put(`http://localhost:7000/post/updatePost/${id}`, updatedData, getAuthHeader());
  return res.data;
});

// Delete post
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await axios.delete(`http://localhost:7000/post/deletePost/${id}`, getAuthHeader());
  return id;
});

// Get post by ID
export const getPostById = createAsyncThunk('posts/getPostById', async (id) => {
  const res = await axios.get(`http://localhost:7000/post/getPostByID/${id}`, getAuthHeader());
  return res.data;
});

// ✅ FIXED: Like a post with better error handling
export const likePost = createAsyncThunk('posts/likePost', async (id, { rejectWithValue }) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    
    if (!userId) {
      throw new Error('User not found');
    }
    
    const res = await axios.post(`http://localhost:7000/post/${id}/like`, {}, getAuthHeader());
    console.log('Like response:', res.data); // Debug log
    
    return { id, userId, post: res.data };
  } catch (error) {
    console.error('Like error:', error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ FIXED: Unlike a post with better error handling
export const unlikePost = createAsyncThunk('posts/unlikePost', async (id, { rejectWithValue }) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id;
    
    if (!userId) {
      throw new Error('User not found');
    }
    
    const res = await axios.post(`http://localhost:7000/post/${id}/unlike`, {}, getAuthHeader());
    console.log('Unlike response:', res.data); // Debug log
    
    return { id, userId, post: res.data };
  } catch (error) {
    console.error('Unlike error:', error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ FIXED: Slice with better state management
const postSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ ADDED: Manual post update for real-time updates
    updatePostInState: (state, action) => {
      const { postId, updatedPost } = action.payload;
      const index = state.items.findIndex(post => post._id === postId);
      if (index !== -1) {
        state.items[index] = updatedPost;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // CREATE
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.items.unshift(action.payload);
        }
      })
      
      // EDIT
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.items.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // DELETE
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(post => post._id !== action.payload);
      })
      
      // GET BY ID
      .addCase(getPostById.fulfilled, (state, action) => {
        const existingPost = state.items.find(post => post._id === action.payload._id);
        if (!existingPost) {
          state.items.push(action.payload);
        } else {
          // Update existing post
          const index = state.items.findIndex(post => post._id === action.payload._id);
          state.items[index] = action.payload;
        }
      })
      
      // ✅ FIXED: Like with proper state update
      .addCase(likePost.fulfilled, (state, action) => {
        const { id, userId, post } = action.payload;
        const existingPost = state.items.find(p => p._id === id);
        if (existingPost) {
          // Update with server response if available, otherwise add userId
          if (post && post.likes) {
            existingPost.likes = post.likes;
          } else if (userId && !existingPost.likes.includes(userId)) {
            existingPost.likes.push(userId);
          }
        }
      })
      
      // ✅ FIXED: Unlike with proper state update
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { id, userId, post } = action.payload;
        const existingPost = state.items.find(p => p._id === id);
        if (existingPost) {
          // Update with server response if available, otherwise remove userId
          if (post && post.likes) {
            existingPost.likes = post.likes;
          } else if (userId) {
            existingPost.likes = existingPost.likes.filter(likeId => likeId !== userId);
          }
        }
      });
  }
});

export const { updatePostInState } = postSlice.actions;
export default postSlice.reducer;
