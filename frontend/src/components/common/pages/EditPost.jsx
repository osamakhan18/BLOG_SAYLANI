import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editPost, getPostById } from '../../../features/posts/postSlice';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts, loading } = useSelector((state) => state.posts);
  const post = posts.find(p => p._id === id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    if (!post && id) {
      dispatch(getPostById(id));
    }
  }, [post, id, dispatch]);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
      });
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await dispatch(editPost({ 
        id, 
        updatedData: { ...formData, tags: tagsArray } 
      })).unwrap();
      
      navigate('/');
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading || !post) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg">
        <p className="text-center text-gray-300">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          name="content"
          placeholder="Content"
          rows="6"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Update Post
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;