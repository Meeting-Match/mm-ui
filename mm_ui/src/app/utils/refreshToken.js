export async function refreshToken() {
  const refreshToken = localStorage.getItem('jwtRefresh');
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await fetch('http://localhost:8001/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to refresh token');
    }

    const data = await response.json();
    // Store the new access token in localStorage
    console.log(response);
    console.log("Refreshed access token:", data.access);
    localStorage.setItem('jwtAccess', data.access);
    return data.access;
  } catch (error) {
    throw new Error('Token refresh failed: ' + error.message);
  }
}

