"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await fetch('http://localhost:8001/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      // console.log(response)
      const data = await response.json();
      console.log(data)
      const access = data.access;
      const refresh = data.refresh;

      localStorage.setItem('jwtAccess', access);
      localStorage.setItem('jwtRefresh', refresh);
      console.log('Logged in successfully!');
      console.log(`Access token: ${access}`)
      router.push('/');

    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default SignIn;

