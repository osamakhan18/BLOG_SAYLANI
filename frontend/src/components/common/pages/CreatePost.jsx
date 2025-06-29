import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../features/posts/postSlice';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
    dispatch(createPost({ ...formData, tags: tagsArray }))
      .unwrap()
      .then(() => navigate('/'));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Content"
          rows="6"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <input
          className="w-full p-3 bg-gray-800 text-white border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;