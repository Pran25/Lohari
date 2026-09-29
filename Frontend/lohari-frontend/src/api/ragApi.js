import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081'
const RAG_BASE = `${API_BASE_URL}/api/rag`

const getToken = () => localStorage.getItem('accessToken')

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

// ============================================
// ASK QUESTION
// ============================================
export const askQuestion = async (question, topK = 5) => {
  const response = await axios.post(
    `${RAG_BASE}/ask`,
    { question, topK },
    authHeaders()
  )
  return response.data
}

// ============================================
// SYNC DATA
// ============================================
export const syncData = async () => {
  const response = await axios.post(`${RAG_BASE}/sync`, {}, authHeaders())
  return response.data
}

// ============================================
// HEALTH CHECK
// ============================================
export const healthCheck = async () => {
  const response = await axios.get(`${RAG_BASE}/health`, authHeaders())
  return response.data
}