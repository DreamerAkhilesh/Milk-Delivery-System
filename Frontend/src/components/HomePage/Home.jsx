import React from 'react'
import Navbar from '../shared/navbar'
import HeroSection from './HeroSection'
import Footer from '../shared/Footer'
import ProductsCatalogue from './ProductCatalogue'

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ProductsCatalogue />
      <Footer />
    </div>
  )
}

export default Home