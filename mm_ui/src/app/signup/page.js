// src/app/signup/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPass: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    const { username, email, password, confirmPass } = formData;

    if (confirmPass !== password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      console.log(data)

      console.log('New user registered!');
      router.push('/signin');

    } catch (err) {
      setError(err.message || 'There was an error with registration.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column: Sign Up form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
        
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            Register
          </button>
        </form>
      </div>

      {/* Right column: gradient background with prompt to sign in */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 md:p-16">
        <h2 className="text-3xl font-bold mb-2">Join Us Today!</h2>
        <p className="text-lg mb-8">Already have an account?</p>
        <a
          href="/signin"
          className="inline-block px-6 py-2 border border-white rounded text-white hover:bg-white hover:text-pink-500 transition"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}

export default SignUp;
