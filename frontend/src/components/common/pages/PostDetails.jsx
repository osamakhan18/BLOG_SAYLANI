import React, { useEffect } from 'react';
import { editPost, deletePost, likePost, unlikePost, getPostById } from '../../../features/posts/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ FIXED: Corrected Redux selector syntax
  const { items: posts } = useSelector((state) => state.posts);
  const post = posts.find(p => p._id === id);
  
  // ✅ FIXED: Better user data handling
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;
  const isLoggedIn = !!localStorage.getItem('token');
  
  // ✅ FIXED: Proper like check with fallback
  const isLiked = post?.likes?.includes(userId) || false;

  useEffect(() => {
    if (!post) {
      dispatch(getPostById(id));
    }
  }, [id, post, dispatch]);

  const handleLike = () => {
    if (isLoggedIn && userId) {
      dispatch(likePost(id));
    }
  };

  const handleUnlike = () => {
    if (isLoggedIn && userId) {
      dispatch(unlikePost(id));
    }
  };

  const handleDelete = () => {
    if (isLoggedIn && window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id)).then(() => navigate('/'));
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow">
        <p className="text-center text-gray-300">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow">
      <h2 className="text-3xl font-bold text-purple-400">{post.title}</h2>
      <p className="mt-4 text-gray-300">{post.content}</p>
      <p className="mt-2 text-sm text-purple-300">
        Tags: {Array.isArray(post.tags) ? post.tags.join(', ') : ''}
      </p>
      <p className="mt-2 text-sm text-gray-400">Likes: {post.likes?.length || 0}</p>

      {isLoggedIn && userId && (
        <div className="flex gap-4 mt-6">
          {!isLiked ? (
            <button 
              onClick={handleLike} 
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Like
            </button>
          ) : (
            <button 
              onClick={handleUnlike} 
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Unlike
            </button>
          )}

          <button 
            onClick={handleEdit}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>

          <button 
            onClick={handleDelete} 
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default PostDetails;