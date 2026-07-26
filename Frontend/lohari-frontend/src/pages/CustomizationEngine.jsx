import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import Loading from '../components/common/Loading'

function CustomizationEngine() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState({
    // Step 1: Size
    width: 6,
    height: 4,
    depth: 0.5,
    unit: 'ft',

    // Step 2: Material
    material: 'Mild Steel',
    materialPrice: 0,

    // Step 3: Finish
    finish: 'Powder Coated',
    finishPrice: 0,

    // Step 4: Colors
    colors: {
      body: '#2C3E50',
      trim: '#E67E22',
      accent: '#F39C12'
    },

    // Step 5: Extras
    extras: {
      handles: false,
      locks: false,
      decorative: false
    },

    // Uploads
    sketchUrl: '',
    cadDrawingUrl: ''
  })

  const [priceEstimate, setPriceEstimate] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])

  const materials = [
    { name: 'Mild Steel', price: 85, unit: 'kg' },
    { name: 'Stainless Steel 304', price: 180, unit: 'kg' },
    { name: 'Aluminum', price: 150, unit: 'kg' },
    { name: 'Brass', price: 220, unit: 'kg' }
  ]

  const finishes = [
    { name: 'Powder Coated', price: 150, unit: 'sqft' },
    { name: 'Galvanized', price: 200, unit: 'sqft' },
    { name: 'Antique Finish', price: 250, unit: 'sqft' },
    { name: 'Polished', price: 300, unit: 'sqft' }
  ]

  const colorOptions = [
    { name: 'Black', code: '#2C3E50' },
    { name: 'Orange', code: '#E67E22' },
    { name: 'Gold', code: '#F39C12' },
    { name: 'White', code: '#ECF0F1' },
    { name: 'Red', code: '#E74C3C' },
    { name: 'Blue', code: '#3498DB' },
    { name: 'Green', code: '#27AE60' }
  ]

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    // Base calculation
    let basePrice = product?.basePrice || 0
    let materialCost = 0
    let finishCost = 0
    let extraCost = 0
    let sizeMultiplier = 1

    // Size impact
    const area = config.width * config.height
    sizeMultiplier = area / 24 // Default 6x4 = 24 sqft

    // Material cost
    const selectedMaterial = materials.find(m => m.name === config.material)
    if (selectedMaterial) {
      materialCost = selectedMaterial.price * area * 0.5
    }

    // Finish cost
    const selectedFinish = finishes.find(f => f.name === config.finish)
    if (selectedFinish) {
      finishCost = selectedFinish.price * area * 0.3
    }

    // Extras
    if (config.extras.handles) extraCost += 500
    if (config.extras.locks) extraCost += 800
    if (config.extras.decorative) extraCost += 1200

    const total = (basePrice * sizeMultiplier) + materialCost + finishCost + extraCost
    setPriceEstimate(Math.round(total))
    return Math.round(total)
  }

  useEffect(() => {
    if (product) {
      calculatePrice()
    }
  }, [config, product])

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleColorChange = (part, color) => {
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        [part]: color
      }
    })
  }

  const handleExtraToggle = (extra) => {
    setConfig({
      ...config,
      extras: {
        ...config.extras,
        [extra]: !config.extras[extra]
      }
    })
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    const formData = new FormData()
    for (let file of files) {
      formData.append('images', file)
    }

    try {
      const response = await axios.post('/customizations/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadedImages([...uploadedImages, ...response.data.urls])
      toast.success('Images uploaded!')
    } catch (error) {
      toast.error('Failed to upload images')
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const orderData = {
        productId: product.id,
        productName: product.name,
        configuration: config,
        priceEstimate: priceEstimate,
        colors: config.colors,
        dimensions: {
          width: config.width,
          height: config.height,
          depth: config.depth,
          unit: config.unit
        },
        material: config.material,
        finish: config.finish,
        extras: config.extras,
        images: uploadedImages
      }

      const response = await axios.post('/customizations/save', orderData)
      toast.success('Configuration saved!')
      
      // Navigate to quote page
      navigate(`/quote/${response.data.id}`)
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="container-custom py-20">
      <h1 className="section-title">Customize Your Product</h1>
      <p className="section-subtitle">Design your perfect {product?.name}</p>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full ${
              s <= step ? 'bg-gradient-to-r from-secondary to-orange-500' : 'bg-white/10'
            }`} />
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="glass p-8 rounded-2xl">
        {/* Step 1: Size */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">📐 Step 1: Choose Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-1">Width ({config.unit})</label>
                <input
                  type="number"
                  className="input-field"
                  value={config.width}
                  onChange={(e) => setConfig({ ...config, width: parseFloat(e.target.value) })}
                  step="0.5"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Height ({config.unit})</label>
                <input
                  type="number"
                  className="input-field"
                  value={config.height}
                  onChange={(e) => setConfig({ ...config, height: parseFloat(e.target.value) })}
                  step="0.5"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Depth ({config.unit})</label>
                <input
                  type="number"
                  className="input-field"
                  value={config.depth}
                  onChange={(e) => setConfig({ ...config, depth: parseFloat(e.target.value) })}
                  step="0.1"
                  min="0.1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Material */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">🔧 Step 2: Select Material</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {materials.map((mat) => (
                <button
                  key={mat.name}
                  className={`glass p-4 rounded-xl text-center transition-all ${
                    config.material === mat.name ? 'border-2 border-secondary' : ''
                  }`}
                  onClick={() => setConfig({ ...config, material: mat.name, materialPrice: mat.price })}
                >
                  <h3 className="text-white font-semibold">{mat.name}</h3>
                  <p className="text-white/50 text-sm">₹{mat.price}/{mat.unit}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Finish */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">🎨 Step 3: Choose Finish</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {finishes.map((fin) => (
                <button
                  key={fin.name}
                  className={`glass p-4 rounded-xl text-center transition-all ${
                    config.finish === fin.name ? 'border-2 border-secondary' : ''
                  }`}
                  onClick={() => setConfig({ ...config, finish: fin.name, finishPrice: fin.price })}
                >
                  <h3 className="text-white font-semibold">{fin.name}</h3>
                  <p className="text-white/50 text-sm">₹{fin.price}/{fin.unit}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Colors */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">🎨 Step 4: Select Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Body Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.code}
                      className={`w-10 h-10 rounded-full border-2 ${
                        config.colors.body === color.code ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => handleColorChange('body', color.code)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Trim Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.code}
                      className={`w-10 h-10 rounded-full border-2 ${
                        config.colors.trim === color.code ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => handleColorChange('trim', color.code)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.code}
                      className={`w-10 h-10 rounded-full border-2 ${
                        config.colors.accent === color.code ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => handleColorChange('accent', color.code)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Extras & Upload */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">📎 Step 5: Extras & Upload</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                className={`glass p-4 rounded-xl text-center transition-all ${
                  config.extras.handles ? 'border-2 border-secondary' : ''
                }`}
                onClick={() => handleExtraToggle('handles')}
              >
                <span className="text-2xl block mb-2">🚪</span>
                <span className="text-white">Handles (+₹500)</span>
              </button>
              <button
                className={`glass p-4 rounded-xl text-center transition-all ${
                  config.extras.locks ? 'border-2 border-secondary' : ''
                }`}
                onClick={() => handleExtraToggle('locks')}
              >
                <span className="text-2xl block mb-2">🔒</span>
                <span className="text-white">Locks (+₹800)</span>
              </button>
              <button
                className={`glass p-4 rounded-xl text-center transition-all ${
                  config.extras.decorative ? 'border-2 border-secondary' : ''
                }`}
                onClick={() => handleExtraToggle('decorative')}
              >
                <span className="text-2xl block mb-2">✨</span>
                <span className="text-white">Decorative (+₹1200)</span>
              </button>
            </div>

            <div className="glass p-4 rounded-xl">
              <label className="block text-white/70 text-sm mb-2">Upload Sketch / Reference Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="input-field"
                onChange={handleImageUpload}
              />
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedImages.map((url, i) => (
                    <img key={i} src={url} alt="Upload" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={step === 1}
          >
            Previous
          </button>
          
          <div className="text-center">
            <p className="text-white/70 text-sm">Estimated Price</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">
              ₹{priceEstimate.toLocaleString()}
            </p>
          </div>

          {step < 5 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit}>
              Submit Quote Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomizationEngine