import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'info' or 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:7000/api/register', form, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      setToastType('success');
        setForm({ username: '', email: '', password: '' });

      
    } catch (err) {
      setMessage(err.response?.data?.message || 'Register failed');
      setToastType('info'); 
    }

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setMessage('');
      setToastType('');
    }, 3000);
  };

  return (
    <>
      {/* TOAST NOTIFICATION */}
      {message && (
        <div className="toast toast-top toast-center z-50">
          {toastType === 'success' && (
            <div className="alert alert-success">
              <span>{message}</span>
            </div>
          )}
          {toastType === 'info' && (
            <div className="alert alert-info">
              <span>{message}</span>
            </div>
          )}
        </div>
      )}

      {/* REGISTER FORM */}
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded bg-gray-700 text-white focus:outline-none"
            required
          />
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
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
