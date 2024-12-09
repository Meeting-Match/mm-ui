import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const jwtRefresh = localStorage.getItem("jwtRefresh");
      if (!jwtRefresh) return false;
      let response = await fetch(`${AUTH_SERVICE_URL}/token/refresh/`,  {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: jwtRefresh }),
      });
      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('jwtAccess', data.access);
      console.log(`Successfully refreshed access token. New token: ${data.access}`);
      return true;
    }
    catch (error) {
      console.log("Failed to refresh token:", error);
      return false;
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const access = localStorage.getItem('jwtAccess');
      console.log("Access token:", access);
      if (access) {
        try {
          const decoded = jwtDecode(access);
          console.log("Decoded token:", decoded);
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setIsAuthenticated(false);
        }
      }
      console.log("Refreshing token...");
      const refreshed = await refreshToken();
      setIsAuthenticated(refreshed);
      setLoading(false);
    }
    checkAuth();
  }, []);

  console.log(`useAuth about to return value of isAuthenticated:`, isAuthenticated);
  console.log(`Also loading is:`, loading);
  return { isAuthenticated, loading } ;
};
