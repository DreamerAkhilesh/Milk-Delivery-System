import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import CurrentDelivery from './CurrentDeliveries'
import Stats from './Stats'
import { setUser } from '../../redux/authSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Load admin data from localStorage if not in Redux state
    if (!user?.id && localStorage.getItem('adminToken')) {
      const storedAdminData = localStorage.getItem('adminData')
      if (storedAdminData) {
        const adminData = JSON.parse(storedAdminData)
        dispatch(setUser(adminData))
      }
    }
  }, [dispatch, user])

  console.log("Current user in Dashboard:", user)

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