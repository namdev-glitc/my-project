import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
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
  const response = await api.post('/events/', event);
  return response.data;
};

export const updateEvent = async (id: number, event: any) => {
  const response = await api.put(`/events/${id}`, event);
  return response.data;
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



