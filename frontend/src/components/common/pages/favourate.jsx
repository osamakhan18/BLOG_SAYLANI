import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiFillHeart } from 'react-icons/ai';
import { fetchPosts } from '../../../features/posts/postSlice';
import { Link } from 'react-router-dom';

function Favourate() {
  const { items: posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  
  // ✅ FIXED: Better user data handling
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;

  // ✅ ADDED: Fetch posts if not already loaded
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  // ✅ FIXED: Better filtering with debug info
  const likedPosts = posts.filter(post => {
    if (!post || !post.likes || !userId) return false;
    return post.likes.includes(userId);
  });

  console.log('User ID:', userId); // Debug log
  console.log('All posts:', posts); // Debug log
  console.log('Liked posts:', likedPosts); // Debug log

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">Liked Posts</h1>
      
      {!userId ? (
        <p className="text-center text-gray-300">Please log in to see your liked posts.</p>
      ) : likedPosts.length === 0 ? (
        <p className="text-center text-gray-300">You haven't liked any posts yet.</p>
      ) : (
        likedPosts.map(post => (
          <div
            key={post._id}
            className="mb-6 p-6 bg-gray-900 text-white rounded shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center">
              <Link to={`/post/${post._id}`}>
                <h2 className="text-2xl font-semibold text-purple-400 mb-2 hover:text-purple-300 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <span className="text-red-400 text-2xl">
                <AiFillHeart />
              </span>
            </div>
            <p className="mb-3 text-gray-300">{post.content}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Tags: <span className="text-purple-300">{Array.isArray(post.tags) ? post.tags.join(', ') : ''}</span>
              </p>
              <p className="text-sm text-gray-400">
                {post.likes?.length || 0} likes
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Favourate;