import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'
const QUOTATION_BASE = `${API_BASE_URL}/api/quotations`

const getToken = () => localStorage.getItem('accessToken')

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

// ============================================
// GENERATE + SEND QUOTATION
// ============================================
export const generateQuotation = async (payload) => {
  const response = await axios.post(
    `${QUOTATION_BASE}/generate`,
    payload,
    authHeaders()
  )
  return response.data
}