"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the JWT tokens
    localStorage.removeItem('jwtAccess');
    localStorage.removeItem('jwtRefresh');

    // Redirect to the login page
    router.push('/signin');
  };

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
}

export default LogoutButton;

