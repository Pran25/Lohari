import axiosInstance from './axios'

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories')
  return response.data
}

export const getActiveCategories = async () => {
  const response = await axiosInstance.get('/categories/active')
  return response.data
}