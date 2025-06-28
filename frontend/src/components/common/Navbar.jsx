import React from 'react'
import { Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function Navbar() {
  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="text-3xl font-bold tracking-widest text-purple-400">
          𝔹𝕃𝕆𝔾𝕀𝔽𝕐
        </div>
        <ul className="flex space-x-6 text-lg">
          <li>
            <Link to="/" className="hover:text-purple-400 transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/post" className="hover:text-purple-400 transition-colors duration-300">
             Create
            </Link>
          </li>
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
           
        </ul>
      </nav>
    </>
  )
}

export default Navbar
