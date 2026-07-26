import axiosInstance from './axios'

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData)
  return response.data
}

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials)
  return response.data
}

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/auth/refresh', { refreshToken })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout')
  return response.data
}

export const validateToken = async () => {
  const response = await axiosInstance.get('/auth/validate')
  return response.data
}