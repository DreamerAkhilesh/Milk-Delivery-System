import React from 'react'
import Navbar from '../shared/navbar'
import Footer from '../shared/Footer'
import CurrentDelivery from './CurrentDeliveries'
import Stats from './Stats'

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Stats />
      <CurrentDelivery />
      <Footer />
    </div>
  )
}

export default Dashboard