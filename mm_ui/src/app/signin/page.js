"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'

import styles from './SignIn.module.css';

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      localStorage.setItem("jwtAccess", data.access);
      localStorage.setItem("jwtRefresh", data.refresh);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Error encountered during handleSignin:", err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column: Sign In form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex items-center justify-between text-sm">
            <div>
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-600">
                Remember Me
              </label>
            </div>
            <a href="#" className="text-indigo-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Or sign in with</span>
        </div>

        <div className="mt-3 flex space-x-4 justify-center">
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            {/* Placeholder icon, replace with FontAwesome or an SVG */}
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-100 transition">
            <span className="sr-only">Sign in with Twitter</span>
            <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
          </button>
        </div>
      </div>

      {/* Right column: gradient background with prompt to sign up */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 md:p-16">
        <h2 className="text-3xl font-bold mb-2">Welcome to login</h2>
        <p className="text-lg mb-8">Don't have an account?</p>
        <a
          href="/signup"
          className="inline-block px-6 py-2 border border-white rounded text-white hover:bg-white hover:text-pink-500 transition"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
