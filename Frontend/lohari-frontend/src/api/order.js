import axiosInstance from './axios'

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('❌ Create order error:', error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    const response = await axiosInstance.get('/orders')
    return response.data
  } catch (error) {
    console.error('❌ Get orders error:', error)
    throw error
  }
}

export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/orders/${id}`)
    return response.data
  } catch (error) {
    console.error('❌ Get order by id error:', error)
    throw error
  }
}

export const getOrderTracking = async (id) => {
  try {
    const response = await axiosInstance.get(`/orders/${id}/tracking`)
    return response.data
  } catch (error) {
    console.error('❌ Get order tracking error:', error)
    throw error
  }
}

export const cancelOrder = async (id, reason) => {
  try {
    const response = await axiosInstance.post(`/orders/${id}/cancel?reason=${reason || ''}`)
    return response.data
  } catch (error) {
    console.error('❌ Cancel order error:', error)
    throw error
  }
}