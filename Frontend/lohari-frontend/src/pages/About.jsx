import React from 'react'

function About() {
  return (
    <div className="container-custom py-20">
      <h1 className="section-title">About Lohari</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-lg text-white/70 leading-relaxed">
            Lohari is a premier metal fabrication and design company dedicated to bringing your ideas to life.
          </p>
          <p className="text-white/60 leading-relaxed">
            With years of experience in the industry, we specialize in creating custom gates, railings, 
            furniture, and artistic pieces that combine functionality with aesthetic appeal.
          </p>
          
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-white/60">
              To deliver exceptional quality and craftsmanship in every project, ensuring customer satisfaction 
              through personalized service and attention to detail.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
            <p className="text-white/60">
              To be the most trusted name in metal fabrication, known for innovation, quality, and reliability.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-3">What We Do</h3>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-center gap-3">
                <span className="text-secondary">▸</span> Custom Gates & Railings
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">▸</span> Metal Furniture Design
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">▸</span> Industrial Fabrication
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">▸</span> Artistic Metal Sculptures
              </li>
              <li className="flex items-center gap-3">
                <span className="text-secondary">▸</span> Custom Prototyping
              </li>
            </ul>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-3">Why Choose Us</h3>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span> 10+ Years Experience
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span> Premium Quality Materials
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span> Custom Designs
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">✓</span> Affordable Pricing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About