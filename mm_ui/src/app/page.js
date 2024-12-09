"use client";
import Image from "next/image";
import React from 'react';
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SignOutButton from './components/SignOutButton';

export default function Home() {
  const [data, setData] = useState(null);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (loading) return;
    console.log(`isAuthenticated = ${isAuthenticated}, loading = ${loading}`)
    console.log("Access token:", localStorage.getItem('jwtAccess'));
    console.log("Refresh token:", localStorage.getItem('jwtRefresh'));
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    async function fetchMessage() {
      try {
        // This will eventually change to be wherever our backend is.
        const access = localStorage.getItem('jwtAccess');
        let response = await fetch("http://localhost:8000/events/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access}`
          }
        });
        let result = await response.json();
        setData(result);
        console.log(result["message"]);
      }
      catch (error) {
        console.log(error);
      }
    }

    fetchMessage();
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>

      <h1>The backend returned:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <SignOutButton />

    </>
  );
}
