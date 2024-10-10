import axios from 'axios';

const apiUrl = 'http://localhost:4004/api';

export const addUser = async (data: FormData ,) => {
  const response = await axios.post(`${apiUrl}/users`,data);
  return response.data;
};

export const getUsers = async (limit:number,pageId:number) => {
  const response = await axios.get(`${apiUrl}/users/?limit=${limit}&page=${pageId}`);
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await axios.get(`${apiUrl}/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: FormData) => {
  const response = await axios.put(`${apiUrl}/users/${id}`, data);
  return response.data;
};
