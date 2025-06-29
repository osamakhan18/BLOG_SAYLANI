import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-3xl font-bold tracking-widest text-purple-400">
        𝔹𝕃𝕆𝔾𝕀𝔽𝕐
      </div>
      
      <ul className="flex space-x-6 text-lg items-center">
        <li>
          <Link to="/" className="hover:text-purple-400 transition-colors duration-300">
            Home
          </Link>
        </li>
        
        {isLoggedIn && (
          <>
            <li>
              <Link to="/favourate" className="hover:text-purple-400 transition-colors duration-300">
                Favourites
              </Link>
            </li>
            <li>
              <Link to="/post" className="hover:text-purple-400 transition-colors duration-300">
                Create
              </Link>
            </li>
            <li>
              {/* <span className="text-purple-300">Welcome, {user.username || user.email}</span> */}
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="hover:text-purple-400 transition-colors duration-300 bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </li>
          </>
        )}
        
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login" className="hover:text-purple-400 transition-colors duration-300">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-purple-400 transition-colors duration-300">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;