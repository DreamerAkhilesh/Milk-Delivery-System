import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import CurrentDelivery from './CurrentDeliveries'
import Stats from './Stats'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)

  console.log("Current user in Dashboard:", user); // Add this for debugging

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#00B86C] mb-6">
          Welcome, {user.name}!
        </h1>
        <Stats />
        <CurrentDelivery />
      </div>
      <Footer />
      <nav>
        <Link
          to="/admin/chat"
          className="hover:text-[#8CE0FC] cursor-pointer"
        >
          Live Chat
        </Link>
      </nav>
    </div>
  )
}

export default Dashboard