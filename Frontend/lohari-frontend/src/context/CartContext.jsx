import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        const updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        toast.success('Quantity updated in cart')
        return updated
      }
      const newCart = [...prev, { ...product, quantity }]
      toast.success('Added to cart!')
      return newCart
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      toast.success('Removed from cart')
      return updated
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    toast.success('Cart cleared')
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}