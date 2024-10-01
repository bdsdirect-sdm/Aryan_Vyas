import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4003/user',
});

export const signup = (data: any) => api.post('/signup', data);
export const login = (data: any) => api.post('/login', data);
export const getProfile = (token: string) => api.get('/profile', {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateProfile = (data: any, token: string) => api.put('/updateProfile', data, {
    headers: { Authorization: `Bearer ${token}` }
});
