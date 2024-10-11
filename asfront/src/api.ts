import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

export const registerUser = async (data: FormData) => {
    console.log(data,"data")
    const response = await axios.post(`${API_URL}/register`, data);
    return response;
};

export const getAgencies = async () => {
    const response = await axios.get(`${API_URL}/agencies`);
    return response;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response;
};

export const getUserProfile = async (token: string) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response;
};

export const getJobSeekers = async (token: string) => {
    const response = await axios.get(`${API_URL}/job-seekers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response;
};

export const requestPasswordReset = async (email: string) => {
    const response = await axios.post(`${API_URL}/password-reset`, { email });
    return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/password-reset/confirm`, { token, newPassword });
    return response.data;
};

