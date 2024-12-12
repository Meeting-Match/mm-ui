const SCHEDULING_SERVICE_URL = process.env.NEXT_PUBLIC_SCHEDULING_SERVICE_URL;
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export const api = async (endpoint, { method = 'GET', body = null, ...customConfig } = {}) => {
  let accessToken = localStorage.getItem('jwtAccess');

  let headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    method,
    headers,
    ...customConfig,
  };

  if (body) {
    console.log('Request Body:', JSON.stringify(body));
    config.body = JSON.stringify(body);
  }

  let response = await fetch(`${SCHEDULING_SERVICE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Attempt to refresh token
    const refreshed = await refreshToken();
    if (refreshed) {
      accessToken = localStorage.getItem('jwtAccess');
      headers['Authorization'] = `Bearer ${accessToken}`;
      config.headers = headers;
      response = await fetch(`${SCHEDULING_SERVICE_URL}${endpoint}`, config);
    } else {
      window.location.href = '/signin';
      return;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail || 'API Error');
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
};

const refreshToken = async () => {
  const jwtRefresh = localStorage.getItem('jwtRefresh');
  if (!jwtRefresh) return false;
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: jwtRefresh }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem('jwtAccess', data.access);
    return true;
  } catch {
    return false;
  }
};
