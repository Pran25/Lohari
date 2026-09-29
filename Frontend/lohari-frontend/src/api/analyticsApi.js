import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'
const ANALYTICS_BASE = `${API_BASE_URL}/api/analytics`

const getToken = () => localStorage.getItem('accessToken')

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

// ============================================
// 1. FULL DASHBOARD
// ============================================
export const getDashboard = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/dashboard`, authHeaders())
  return response.data
}

// ============================================
// 2. SUMMARY ONLY
// ============================================
export const getSummary = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/summary`, authHeaders())
  return response.data
}

// ============================================
// 3. MONTHLY REVENUE
// ============================================
export const getMonthlyRevenue = async (months = 6) => {
  const response = await axios.get(`${ANALYTICS_BASE}/revenue`, {
    ...authHeaders(),
    params: { months },
  })
  return response.data
}

// ============================================
// 4. ORDERS BY STATUS
// ============================================
export const getOrdersByStatus = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/orders-by-status`, authHeaders())
  return response.data
}

// ============================================
// 5. TOP PRODUCTS
// ============================================
export const getTopProducts = async (limit = 5) => {
  const response = await axios.get(`${ANALYTICS_BASE}/top-products`, {
    ...authHeaders(),
    params: { limit },
  })
  return response.data
}

// ============================================
// 6. TOP CUSTOMERS
// ============================================
export const getTopCustomers = async (limit = 5) => {
  const response = await axios.get(`${ANALYTICS_BASE}/top-customers`, {
    ...authHeaders(),
    params: { limit },
  })
  return response.data
}

// ============================================
// 7. DAILY ORDERS (Last N Days)
// ============================================
export const getDailyOrders = async (days = 30) => {
  const response = await axios.get(`${ANALYTICS_BASE}/daily-orders`, {
    ...authHeaders(),
    params: { days },
  })
  return response.data
}

// ============================================
// 8. CATEGORY SALES
// ============================================
export const getCategorySales = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/category-sales`, authHeaders())
  return response.data
}

// ============================================
// 9. CUSTOMER SPLIT (New vs Returning)
// ============================================
export const getCustomerSplit = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/customer-split`, authHeaders())
  return response.data
}

// ============================================
// 10. PAYMENT METHODS
// ============================================
export const getPaymentMethods = async () => {
  const response = await axios.get(`${ANALYTICS_BASE}/payment-methods`, authHeaders())
  return response.data
}

// ============================================
// 11. CITY DISTRIBUTION
// ============================================
export const getCityDistribution = async (limit = 10) => {
  const response = await axios.get(`${ANALYTICS_BASE}/cities`, {
    ...authHeaders(),
    params: { limit },
  })
  return response.data
}

// ============================================
// 12. REVENUE GROWTH %
// ============================================
export const getRevenueGrowth = async (months = 6) => {
  const response = await axios.get(`${ANALYTICS_BASE}/revenue-growth`, {
    ...authHeaders(),
    params: { months },
  })
  return response.data
}