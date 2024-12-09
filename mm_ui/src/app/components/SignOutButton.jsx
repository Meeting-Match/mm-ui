'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton({ className = '' }) {
  const router = useRouter();

  const handleSignOut = () => {
    // Remove tokens from local storage
    localStorage.removeItem('jwtAccess');
    localStorage.removeItem('jwtRefresh');
    
    // Redirect to sign-in page
    router.push('/signin');
  };

  return (
    <button
      onClick={handleSignOut}
      className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${className}`}
    >
      Sign Out
    </button>
  );
}
