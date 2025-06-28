import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:7000/api/login', form, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      setToastType('success');
      localStorage.setItem('token', res.data.token);
        setForm({email: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
      setToastType('error');
    }

    // Clear toast after 3 seconds
    setTimeout(() => {
      setMessage('');
      setToastType('');
    }, 1000);
  };

  return (
    <>
      {/* TOAST */}
      {message && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
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
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
