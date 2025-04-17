import React, { useState } from "react";
import Navbar from "../shared/Navbar";

const usersData = [
  {
    id: 1,
    name: "Aarav Mehta",
    products: ["Milk", "Paneer"],
    quantities: { Milk: 1, Paneer: 2 },
    wallet: 120,
    status: "active",
    address: "123 MG Road, Mumbai",
    contact: "9876543210",
    startDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Saanvi Verma",
    products: ["Curd"],
    quantities: { Curd: 1 },
    wallet: 80,
    status: "paused",
    address: "45 Sector 10, Noida",
    contact: "9123456780",
    startDate: "2023-12-05",
  },
  {
    id: 3,
    name: "Kabir Shah",
    products: ["Milk"],
    quantities: { Milk: 2 },
    wallet: 150,
    status: "active",
    address: "67 Park Street, Kolkata",
    contact: "9001234567",
    startDate: "2024-02-01",
  },
  {
    id: 4,
    name: "Anaya Singh",
    products: ["Milk", "Curd"],
    quantities: { Milk: 1, Curd: 1 },
    wallet: 60,
    status: "paused",
    address: "21 Residency Rd, Bangalore",
    contact: "9812345678",
    startDate: "2023-11-20",
  },
  {
    id: 5,
    name: "Rohan Desai",
    products: ["Paneer"],
    quantities: { Paneer: 1 },
    wallet: 90,
    status: "active",
    address: "5 Patel Nagar, Ahmedabad",
    contact: "9988776655",
    startDate: "2024-03-15",
  },
  {
    id: 6,
    name: "Diya Nair",
    products: ["Curd", "Milk"],
    quantities: { Curd: 1, Milk: 2 },
    wallet: 200,
    status: "active",
    address: "8 Beach Rd, Chennai",
    contact: "9090909090",
    startDate: "2024-01-25",
  },
  {
    id: 7,
    name: "Ishaan Kumar",
    products: ["Milk"],
    quantities: { Milk: 1 },
    wallet: 50,
    status: "paused",
    address: "32 Civil Lines, Lucknow",
    contact: "9887766554",
    startDate: "2023-10-10",
  },
  {
    id: 8,
    name: "Meera Joshi",
    products: ["Paneer", "Curd"],
    quantities: { Paneer: 1, Curd: 1 },
    wallet: 100,
    status: "active",
    address: "76 Tilak Nagar, Indore",
    contact: "9998887776",
    startDate: "2024-01-08",
  },
  {
    id: 9,
    name: "Ayaan Chauhan",
    products: ["Milk"],
    quantities: { Milk: 2 },
    wallet: 75,
    status: "paused",
    address: "19 Sector 5, Chandigarh",
    contact: "9871234560",
    startDate: "2023-09-25",
  },
  {
    id: 10,
    name: "Riya Kapoor",
    products: ["Milk", "Paneer"],
    quantities: { Milk: 1, Paneer: 2 },
    wallet: 110,
    status: "active",
    address: "42 JLN Marg, Jaipur",
    contact: "9785612345",
    startDate: "2024-02-10",
  },
  {
    id: 11,
    name: "Tanishq Reddy",
    products: ["Curd"],
    quantities: { Curd: 1 },
    wallet: 60,
    status: "active",
    address: "10 Road No 5, Hyderabad",
    contact: "9876540000",
    startDate: "2024-01-02",
  },
  {
    id: 12,
    name: "Pooja Mishra",
    products: ["Milk"],
    quantities: { Milk: 2 },
    wallet: 95,
    status: "paused",
    address: "66 Church Road, Bhopal",
    contact: "9099998888",
    startDate: "2023-11-11",
  },
  {
    id: 13,
    name: "Aditya Bansal",
    products: ["Paneer"],
    quantities: { Paneer: 1 },
    wallet: 85,
    status: "active",
    address: "14 Nehru Place, Delhi",
    contact: "9112233445",
    startDate: "2024-02-18",
  },
  {
    id: 14,
    name: "Nisha Jain",
    products: ["Curd", "Milk"],
    quantities: { Curd: 1, Milk: 1 },
    wallet: 120,
    status: "active",
    address: "55 Green Park, Pune",
    contact: "9321567890",
    startDate: "2024-01-12",
  },
  {
    id: 15,
    name: "Devansh Bhatt",
    products: ["Milk"],
    quantities: { Milk: 1 },
    wallet: 70,
    status: "paused",
    address: "101 Rajendra Nagar, Patna",
    contact: "9898989898",
    startDate: "2023-12-01",
  },
];

const UserManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredUsers =
    selectedCategory === "active"
      ? usersData.filter((u) => u.status === "active")
      : selectedCategory === "paused"
      ? usersData.filter((u) => u.status === "paused")
      : usersData;

  return (
    <>
      <Navbar />
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#49BDE9]">User Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div
          className="bg-white border-l-4 border-[#49BDE9] rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg"
          onClick={() => handleSelect("total")}
        >
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-2xl font-semibold text-gray-800">{usersData.length}</h2>
        </div>
        <div
          className="bg-white border-l-4 border-green-400 rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg"
          onClick={() => handleSelect("active")}
        >
          <p className="text-gray-500">Active Users</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {usersData.filter((u) => u.status === "active").length}
          </h2>
        </div>
        <div
          className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg"
          onClick={() => handleSelect("paused")}
        >
          <p className="text-gray-500">Paused Subscriptions</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {usersData.filter((u) => u.status === "paused").length}
          </h2>
        </div>
        <div className="bg-white border-l-4 border-purple-400 rounded-lg shadow-md p-5">
          <p className="text-gray-500">Other Info</p>
          <h2 className="text-2xl font-semibold text-gray-800">--</h2>
        </div>
      </div>

      {/* Users Table */}
      {selectedCategory && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#49BDE9] text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Subscribed Products</th>
                <th className="px-4 py-3">Quantity / Day</th>
                <th className="px-4 py-3">Wallet (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.products.join(", ")}</td>
                  <td className="px-4 py-3">
                    {Object.entries(user.quantities).map(([product, qty]) => (
                      <div key={product}>{`${product}: ${qty}`}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">₹{user.wallet}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.address}</td>
                  <td className="px-4 py-3">{user.contact}</td>
                  <td className="px-4 py-3">{user.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default UserManagement;