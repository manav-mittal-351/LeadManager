const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('lead_manager_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      // Network/Server down error
      const networkError = new Error('Cannot connect to the server. Please check your backend connection.');
      networkError.status = 503;
      throw networkError;
    }
    throw err;
  }
}

export const leadsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.source && params.source !== 'All') query.append('source', params.source);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/leads${queryString}`);
  },

  getStats: () => request('/leads/stats'),

  getById: (id) => request(`/leads/${id}`),

  create: (leadData) =>
    request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }),

  update: (id, leadData) =>
    request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    }),

  delete: (id) =>
    request(`/leads/${id}`, {
      method: 'DELETE',
    }),
};

export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  demoLogin: () =>
    request('/auth/demo-login', {
      method: 'POST',
    }),

  getMe: () => request('/auth/me'),
};
