import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, likePost, unlikePost, deletePost } from '../../../features/posts/postSlice';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiFillDelete, AiFillEdit } from 'react-icons/ai';

function Home() {
  const { items: posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    if (isLoggedIn) {
      dispatch(likePost(postId));
    }
  };

  const handleUnlike = (postId) => {
    if (isLoggedIn) {
      dispatch(unlikePost(postId));
    }
  };

  const handleDelete = (postId) => {
    if (isLoggedIn && window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">Recent Posts</h1>
      
      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : !Array.isArray(posts) || posts.length === 0 ? (
        <p className="text-center text-gray-300">No posts available.</p>
      ) : (
        posts
          .filter((post) => post && post._id)
          .map((post) => {
            const isLiked = post.likes?.includes(userId) || false;
            
            return (
              <div
                key={post._id}
                className="mb-6 p-6 bg-gray-900 text-white rounded shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/post/${post._id}`}>
                    <h2 className="text-2xl font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  {isLoggedIn && (
                    <div className="flex gap-2 items-center">
                      {/* Like/Unlike Button */}
                      <button
                        onClick={() => isLiked ? handleUnlike(post._id) : handleLike(post._id)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        {isLiked ? (
                          <AiFillHeart className="text-red-500" />
                        ) : (
                          <AiOutlineHeart className="text-gray-400 hover:text-red-500" />
                        )}
                      </button>
                      
                      {/* Edit Button */}
                      <Link to={`/edit/${post._id}`}>
                        <AiFillEdit className="text-blue-500 hover:text-blue-400 text-xl cursor-pointer hover:scale-110 transition-transform" />
                      </Link>
                      
                      {/* Delete Button */}
                      <button onClick={() => handleDelete(post._id)}>
                        <AiFillDelete className="text-red-500 hover:text-red-400 text-xl cursor-pointer hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="mb-3 text-gray-300">{post.content}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Tags:{' '}
                    <span className="text-purple-300">
                      {Array.isArray(post.tags) ? post.tags.join(', ') : ''}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    {post.likes?.length || 0} likes
                  </p>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Home;