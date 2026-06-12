const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildHeaders = (token, hasBody = false) => {
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (endpoint, { method = 'GET', body, token } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: buildHeaders(token, Boolean(body)),
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }
    return data;
  } catch (err) {
    // Network errors (CORS, DNS, refused connection) will be caught here
    console.error('API request error', { endpoint, method, err });
    throw new Error(err.message || 'Network error');
  }
};

export const api = {
  get: (endpoint, token) => request(endpoint, { method: 'GET', token }),
  post: (endpoint, body, token) => request(endpoint, { method: 'POST', body, token }),
  patch: (endpoint, body, token) => request(endpoint, { method: 'PATCH', body, token }),
};
