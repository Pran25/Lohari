import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useOfflineDetection } from './hooks/useOfflineDetection'
import Loading from './components/common/Loading'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetailPage from './pages/ProductDetailPage'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import OAuth2Callback from './pages/OAuth2Callback'
import Profile from './pages/Profile'
import Orders from './pages/Order'
import OrderDetail from './pages/OrderDetail'
import Checkout from './pages/Checkout'
import Cart from './pages/Cart'
import CustomizationEngine from './pages/CustomizationEngine'
import PaymentPage from './pages/PaymentPage'

// ✅ Analytics
import AnalyticsDashboard from './pages/AnalyticsDashboard'

// ✅ AI Assistant (RAG)
import RagChat from './pages/RagChat'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminUsers from './pages/admin/AdminUsers'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminCoupons from './pages/admin/AdminCoupons'   // ✅ ADDED

// ✅ Component for offline detection
const OfflineHandler = () => {
  useOfflineDetection()
  return null
}

const LandingPage = () => {
  const { user } = useAuth()
  return user ? <Home /> : <Login />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '12px',
              }
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <>
        <OfflineHandler />
        <main className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineHandler />
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={
            <ProtectedRoute><Products /></ProtectedRoute>
          } />
          <Route path="/products/:slug" element={
            <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/customize/:productId" element={
            <ProtectedRoute><CustomizationEngine /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute><PaymentPage /></ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute adminOnly>
              <AnalyticsDashboard />
            </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute adminOnly>
              <RagChat />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProducts key="new-product" startInCreateMode />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App