import axiosInstance from './axios'

export const getProducts = async () => {
  const response = await axiosInstance.get('/products')
  return response.data
}

export const getProductBySlug = async (slug) => {
  const response = await axiosInstance.get(`/products/slug/${slug}`)
  return response.data
}

export const getFeaturedProducts = async () => {
  const response = await axiosInstance.get('/products/featured')
  return response.data
}

export const getTrendingProducts = async () => {
  const response = await axiosInstance.get('/products/trending')
  return response.data
}

export const searchProducts = async (keyword) => {
  const response = await axiosInstance.get(`/products/search?keyword=${keyword}`)
  return response.data
}