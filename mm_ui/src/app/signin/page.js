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
  const {isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/token/`, {
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
      console.error("Error encountered during handleSignin:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          className={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className={styles.button} type="submit">Sign In</button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default SignIn;
