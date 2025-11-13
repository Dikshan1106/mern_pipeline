import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const register = (username, email, password) => {
  return axios.post(`${API_URL}/api/auth/register`, {
    username,
    email,
    password,
  });
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
};

export const getCurrentUser = (token) => {
  return axios.get(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllStudents = (token) => {
  return axios.get(`${API_URL}/api/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStudentById = (id, token) => {
  return axios.get(`${API_URL}/api/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createStudent = (studentData, token) => {
  return axios.post(`${API_URL}/api/students`, studentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStudent = (id, studentData, token) => {
  return axios.put(`${API_URL}/api/students/${id}`, studentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteStudent = (id, token) => {
  return axios.delete(`${API_URL}/api/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
