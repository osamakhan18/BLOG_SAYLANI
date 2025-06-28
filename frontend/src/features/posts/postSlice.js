import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem('token');

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await axios.get('http://localhost:7000/post/getAllPosts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
  const res = await axios.post('http://localhost:7000/post/newPost', postData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // ✅ important
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.items.unshift(action.payload);
        }
      });
  }
});

export default postSlice.reducer;
