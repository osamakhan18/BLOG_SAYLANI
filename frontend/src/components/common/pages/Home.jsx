import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../features/posts/postSlice';

function Home() {
  const { items: posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center">Recent Posts</h1>
      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : !Array.isArray(posts) || posts.length === 0 ? (
        <p className="text-center text-gray-300">No posts available.</p>
      ) : (
        posts
          .filter((post) => post && post._id) // filter out undefined/null posts
          .map((post) => (
            <div
              key={post._id}
              className="mb-6 p-6 bg-gray-900 text-white rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-purple-400 mb-2">{post.title}</h2>
              <p className="mb-3 text-gray-300">{post.content}</p>
              <p className="text-sm text-gray-400">
                Tags:{' '}
                <span className="text-purple-300">
                  {Array.isArray(post.tags) ? post.tags.join(', ') : ''}
                </span>
              </p>
            </div>
          ))
      )}
    </div>
  );
}

export default Home;
