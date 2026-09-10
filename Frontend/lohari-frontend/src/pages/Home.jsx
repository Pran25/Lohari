import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiShield, FiTool } from 'react-icons/fi'

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/80 text-sm">Trusted by 100+ clients</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-white">Build Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-purple-400">
                  Vision in Metal
                </span>
              </h1>
              
              <p className="text-lg text-white/70 max-w-lg">
                Custom metal fabrication and design services. From gates to furniture, we bring your ideas to life with precision and quality.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary flex items-center gap-2 group">
                  Explore Products
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Get a Quote
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/50 text-sm">Projects Done</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">100+</div>
                  <div className="text-white/50 text-sm">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-white/50 text-sm">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Card */}
            <div className="relative">
              <div className="glass p-8 rounded-2xl card-3d relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-secondary to-purple-500 rounded-full blur-2xl opacity-50"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-orange-500 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(230,126,34,0.3)]">
                    🔧
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Custom Fabrication</h3>
                    <p className="text-white/50 text-sm">End-to-end solutions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 glass p-3 rounded-xl">
                    <FiShield className="text-secondary text-xl" />
                    <span className="text-white/80">Quality Craftsmanship</span>
                  </div>
                  <div className="flex items-center gap-3 glass p-3 rounded-xl">
                    <FiStar className="text-yellow-400 text-xl" />
                    <span className="text-white/80">Premium Materials</span>
                  </div>
                  <div className="flex items-center gap-3 glass p-3 rounded-xl">
                    <FiTool className="text-secondary text-xl" />
                    <span className="text-white/80">Custom Designs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="section-title text-center">Why Choose Lohari?</h2>
          <p className="section-subtitle text-center">We combine craftsmanship with innovation</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Custom Design', desc: 'Tailor-made solutions for your specific needs' },
              { icon: '⚡', title: 'Quality Craftsmanship', desc: 'Precision fabrication with premium materials' },
              { icon: '📦', title: 'End-to-End Service', desc: 'From design to delivery, we handle everything' },
            ].map((feature, index) => (
              <div key={index} className="glass p-8 rounded-2xl card-3d text-center group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home