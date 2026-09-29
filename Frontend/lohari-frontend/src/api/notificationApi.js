import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'
const ORDERS_BASE = `${API_BASE_URL}/api/orders`

const getToken = () => localStorage.getItem('accessToken')

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

// ============================================
// FETCH RECENT ORDERS (for notification detection)
// ============================================
export const getRecentOrders = async (limit = 10) => {
  try {
    const response = await axios.get(`${ORDERS_BASE}`, {
      ...authHeaders(),
      params: {
        page: 0,
        size: limit,
        sort: 'createdAt,desc',
      },
    })

    // Handle paginated or plain array response
    if (response.data?.content && Array.isArray(response.data.content)) {
      return response.data.content
    }
    if (Array.isArray(response.data)) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('❌ Failed to fetch recent orders:', error)
    return []
  }
}