import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useOfflineDetection } from './hooks/useOfflineDetection'
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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminUsers from './pages/admin/AdminUsers'
import AdminInquiries from './pages/admin/AdminInquiries'

// ✅ Component for offline detection
const OfflineHandler = () => {
  useOfflineDetection()
  return null
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {/* ✅ Add offline handler */}
            <OfflineHandler />
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/customize/:productId" element={
                  <ProtectedRoute>
                    <CustomizationEngine />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
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

export default App