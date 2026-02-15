const API_BASE = '/api';

// ============================================================
// Token management
// ============================================================
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// ============================================================
// Fetch wrapper with auth
// ============================================================
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If 401 with TOKEN_EXPIRED, try refresh
  if (response.status === 401) {
    const body = await response.json().catch(() => ({}));
    if (body.code === 'TOKEN_EXPIRED') {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${getAccessToken()}`;
        response = await fetch(url, { ...options, headers });
      }
    }
  }

  return response;
};

// ============================================================
// Auth API
// ============================================================
export const apiRegister = async (data) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  let result;
  try {
    result = await response.json();
  } catch {
    return {
      success: false,
      message: 'เซิร์ฟเวอร์ตอบกลับผิดพลาด กรุณาลองใหม่',
      message_en: 'Invalid server response, please try again',
    };
  }

  if (result.success && result.data) {
    setTokens(result.data.accessToken, result.data.refreshToken);
    setStoredUser(result.data.user);
  }

  return result;
};

export const apiLogin = async (data) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (result.success && result.data) {
    setTokens(result.data.accessToken, result.data.refreshToken);
    setStoredUser(result.data.user);
  }

  return result;
};

export const apiLogout = async () => {
  const refreshToken = getRefreshToken();
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // ignore
  }
  clearTokens();
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const result = await response.json();

    if (result.success && result.data) {
      setTokens(result.data.accessToken, result.data.refreshToken);
      setStoredUser(result.data.user);
      return true;
    }
  } catch {
    // ignore
  }

  clearTokens();
  return false;
};

export const apiGetProfile = async () => {
  const response = await apiFetch('/auth/profile');
  return response.json();
};

export const apiUpdateProfile = async (data) => {
  const response = await apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.success && result.data) {
    setStoredUser(result.data.user);
  }
  return result;
};
