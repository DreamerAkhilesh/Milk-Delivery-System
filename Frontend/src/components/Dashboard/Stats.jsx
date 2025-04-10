import React from 'react';

const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-2xl font-bold text-[#00B86C]">0</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Active Subscriptions</h3>
        <p className="text-2xl font-bold text-[#00B86C]">0</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Today's Deliveries</h3>
        <p className="text-2xl font-bold text-[#00B86C]">0</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold text-[#00B86C]">₹0</p>
      </div>
    </div>
  );
};

export default Stats;
