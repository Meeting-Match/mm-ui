// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Ensure this is imported
import { refreshToken as refreshAccessToken } from '../app/utils/refreshToken'; // Adjust the import path if necessary

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Function to refresh the access token
  const refreshToken = async () => {
    return await refreshAccessToken();
  };

  useEffect(() => {
    (async () => {
      const access = localStorage.getItem('jwtAccess');
      if (access) {
        try {
          const decoded = jwtDecode(access);
          console.log("Decoded JWT:", decoded); // Debugging
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            const refreshed = await refreshToken();
            setIsAuthenticated(refreshed);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setIsAuthenticated(false);
        }
      } else {
        // No access token means not authenticated
        setIsAuthenticated(false);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // Fetch user info if authenticated
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        const access = localStorage.getItem('jwtAccess');
        try {
          const res = await fetch(`${AUTH_SERVICE_URL}/userinfo/`, {
            headers: { Authorization: `Bearer ${access}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            console.log("Fetched user data:", data); // Debugging
          } else {
            console.error('Failed to fetch user info:', res.status, res.statusText);
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    fetchUserInfo();
  }, [isAuthenticated]);

  return { isAuthenticated, loading, user };
};
