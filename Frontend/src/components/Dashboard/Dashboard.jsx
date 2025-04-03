import React from 'react'
import Navbar from '../shared/navbar'
import Footer from '../shared/Footer'
import CurrentDelivery from './CurrentDeliveries'

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <CurrentDelivery />
      <Footer />
    </div>
  )
}

export default Dashboard