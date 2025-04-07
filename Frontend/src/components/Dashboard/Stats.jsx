import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUsers, FiPauseCircle, FiDollarSign, FiTruck, FiXCircle } from "react-icons/fi";

const StatCard = ({ icon, title, value, subText, bg }) => (
  <div className={`p-6 rounded-lg shadow-md ${bg} flex flex-col items-center`}>
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-2xl font-semibold">{value}</p>
    {subText && <p className="text-sm text-gray-600">{subText}</p>}
  </div>
);

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/admin/dashboard-stats"); // Ensure API is correct
        console.log("Dashboard Stats:", response.data); // Debugging API Response
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center py-4">Loading stats...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">📊 Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Active Users */}
        <StatCard
          icon={<FiUsers size={30} className="text-blue-500" />}
          title="Total Active Users"
          value={stats?.activeUsers || 0}
          bg="bg-blue-100"
        />

        {/* Paused Subscriptions */}
        <StatCard
          icon={<FiPauseCircle size={30} className="text-yellow-500" />}
          title="Paused Subscriptions"
          value={stats?.pausedSubscriptions?.total || 0}  // Use optional chaining
          subText={`Voluntary: ${stats?.pausedSubscriptions?.voluntary || 0}, Insufficient: ${stats?.pausedSubscriptions?.insufficientBalance || 0}`}
          bg="bg-yellow-100"
        />

        {/* Wallet Transactions Summary */}
        <StatCard
          icon={<FiDollarSign size={30} className="text-green-500" />}
          title="Wallet Transactions"
          value={`₹${stats?.walletSummary?.total || 0}`}
          subText={`Credited: ₹${stats?.walletSummary?.credited || 0}, Debited: ₹${stats?.walletSummary?.debited || 0}`}
          bg="bg-green-100"
        />

        {/* Deliveries Completed */}
        <StatCard
          icon={<FiTruck size={30} className="text-purple-500" />}
          title="Deliveries Completed"
          value={stats?.deliveriesCompleted || 0}
          bg="bg-purple-100"
        />

        {/* Failed Deliveries */}
        <StatCard
          icon={<FiXCircle size={30} className="text-red-500" />}
          title="Failed Deliveries"
          value={stats?.failedDeliveries || 0}
          bg="bg-red-100"
        />
      </div>
    </div>
  );
};

export default Stats;
