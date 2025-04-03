import React from 'react'
import Navbar from '../shared/navbar'
import HeroSection from './HeroSection'
import Footer from '../shared/Footer'
import ProductsCatalogue from './ProductCatalogue'
import TrustSection from './TrustSection'

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ProductsCatalogue />
      <TrustSection />
      <Footer />
    </div>
  )
}

export default Home