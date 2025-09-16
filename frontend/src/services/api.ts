import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          } else {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Guest API
export const getGuests = async (params: any = {}) => {
  const response = await api.get('/guests/', { params });
  return response.data;
};

export const getGuest = async (id: number) => {
  const response = await api.get(`/guests/${id}`);
  return response.data;
};

export const createGuest = async (guest: any) => {
  const response = await api.post('/guests/', guest);
  return response.data;
};

export const updateGuest = async (id: number, guest: any) => {
  const response = await api.put(`/guests/${id}`, guest);
  return response.data;
};

export const deleteGuest = async (id: number) => {
  const response = await api.delete(`/guests/${id}`);
  return response.data;
};

export const updateGuestRSVP = async (id: number, rsvp: any) => {
  const response = await api.post(`/guests/${id}/rsvp`, rsvp);
  return response.data;
};

export const checkinGuest = async (id: number, checkin: any) => {
  const response = await api.post(`/guests/${id}/checkin`, checkin);
  return response.data;
};

export const getGuestQR = async (id: number) => {
  const response = await api.get(`/guests/${id}/qr`);
  return response.data;
};

export const importGuests = async (file: File, eventId: number) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/guests/import', formData, {
    params: { event_id: eventId },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getGuestStats = async () => {
  const response = await api.get('/guests/stats/summary');
  return response.data;
};

// Event API
export const getEvents = async (params: any = {}) => {
  const response = await api.get('/events/', { params });
  return response.data;
};

export const getEvent = async (id: number) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (event: any) => {
  console.log('🔍 API: createEvent - Sending data:', event);
  try {
    const response = await api.post('/events/', event);
    console.log('✅ API: createEvent - Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: createEvent - Error:', error);
    throw error;
  }
};

export const updateEvent = async (id: number, event: any) => {
  console.log('🔍 API: updateEvent - Sending data:', { id, event });
  try {
    const response = await api.put(`/events/${id}`, event);
    console.log('✅ API: updateEvent - Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: updateEvent - Error:', error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const getEventStats = async (id: number) => {
  const response = await api.get(`/events/${id}/stats`);
  return response.data;
};

// QR Code API
export const generateQRCode = async (guestId: number) => {
  const response = await api.get(`/guests/${guestId}/qr`);
  return response.data;
};

// Export API
export const exportGuestsCSV = async (params: any = {}) => {
  const response = await api.get('/guests/export/csv', { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

export const exportGuestsExcel = async (params: any = {}) => {
  const response = await api.get('/guests/export/excel', { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

export default api;



