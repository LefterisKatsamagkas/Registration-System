// userApi.js
import axios from 'axios';

export async function login(email, password) {
  try {
    const response = await axios.post('/api/users/auth', { email, password });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function register(name, email, password) {
  try {
    const response = await axios.post('/api/users/', { name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const response = await axios.post('/api/users/logout');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}