const API_BASE = '/api';

function getAuthHeaders() {
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
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let defaultMsg = `Request failed with status ${response.status}`;
      if (response.status === 502 || response.status === 504) {
        defaultMsg = 'Cannot reach backend server. Please make sure the backend is running on port 5000.';
      }
      const error = new Error(data.message || defaultMsg);
      error.status = response.status;
      error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      const networkError = new Error('Cannot connect to the server. Please check your backend connection.');
      networkError.status = 503;
      throw networkError;
    }
    throw err;
  }
}

export const authApi = {
  signup: (userData) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me'),
};

export const leadsApi = {
  // Get paginated leads with search and status filter
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.status && params.status !== 'All') query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/leads${queryString}`);
  },

  // Get status counts for the logged-in user
  getDashboardCounts: () => request('/leads/dashboard'),

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
