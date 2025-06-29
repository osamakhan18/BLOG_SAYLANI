import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:7000/api/login', form, {
        withCredentials: true,
      });
      
      console.log('Login response:', res.data); // Debug log
      
      setMessage(res.data.message);
      setToastType('success');
      
      // ✅ FIXED: Proper token and user data storage
      localStorage.setItem('token', res.data.token);
      
      // ✅ FIXED: Handle different possible response structures
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else if (res.data.data) {
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
      
      setForm({ email: '', password: '' });
      
      // Navigate to home after successful login
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Force refresh to update navbar
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err.response?.data); // Debug log
      setMessage(err.response?.data?.message || 'Login failed');
      setToastType('error');
    }

    // Clear toast after 3 seconds
    setTimeout(() => {
      setMessage('');
      setToastType('');
    }, 3000);
  };

  return (
    <>
      {/* TOAST */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`alert ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded`}>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* LOGIN FORM */}
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 p-3 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;