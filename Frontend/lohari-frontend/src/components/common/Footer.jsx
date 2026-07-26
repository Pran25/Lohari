import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="glass-dark border-t border-white/10 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">🏗️ Lohari</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Custom metal fabrication and design services. From gates to furniture, we bring your ideas to life.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/40 hover:text-secondary transition-colors text-xl">
                <FiInstagram />
              </a>
              <a href="#" className="text-white/40 hover:text-secondary transition-colors text-xl">
                <FiFacebook />
              </a>
              <a href="#" className="text-white/40 hover:text-secondary transition-colors text-xl">
                <FiYoutube />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-white/60 hover:text-secondary transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-white/60 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-secondary transition-colors">Contact</Link></li>
              <li><Link to="/orders" className="text-white/60 hover:text-secondary transition-colors">Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-white/60">
                <FiMapPin className="text-secondary" /> 123 Industrial Area
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <FiPhone className="text-secondary" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <FiMail className="text-secondary" /> info@lohari.com
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <FiClock className="text-secondary" /> Mon-Sat: 9AM - 6PM
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-3">
              Get updates on new designs and offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 rounded-l-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button className="bg-gradient-to-r from-secondary to-orange-500 px-4 py-2 rounded-r-xl hover:scale-105 transition-transform">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Lohari Fabrication. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer