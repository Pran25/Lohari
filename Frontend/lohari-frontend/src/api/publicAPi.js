import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'
const PUBLIC_BASE = `${API_BASE_URL}/api/public`

// ============================================
// GET PUBLIC STATS (no auth needed)
// ============================================
export const getPublicStats = async () => {
  const response = await axios.get(`${PUBLIC_BASE}/stats`)
  return response.data
}