import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

//creating axios instance with custome config

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application.json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

//response intereceptor for handling the token refres

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try{
                const refresToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/token/refresh/`,{
                    refresh: refresToken
                });
                
                const {access} = response.data;
                localStorage.setItem('access_token',access);

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            }catch (error) {
                // Refresh token has expired, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth service function

export const authService = {
    async login(username, password) {
        const response = await api.post('/token/', { username, password });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        return response.data;
    },

    async register(userData) {
        return await api.post('/users/register/', userData);
    },

    async getUserProfile() {
        return await api.get('/users/profile/');
    },

    async updateProfile(userData) {
        return await api.put('/users/profile/', userData);
    },

    async uploadProfileImage(file) {
        const formData = new FormData();
        formData.append('profile_image', file);
        return await api.post('/users/profile/upload-image/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default api;