import React, { useState, useEffect } from "react";

const CurrentDelivery = () => {
  // Sample data for testing purposes
  const sampleDeliveries = [
    {
      userId: "1",
      name: "John Doe",
      address: "123 Main St, Springfield, USA",
      subscriptionType: "Daily Milk",
      walletBalance: 100,
    },
    {
      userId: "2",
      name: "Jane Smith",
      address: "456 Elm St, Shelbyville, USA",
      subscriptionType: "Weekly Yogurt",
      walletBalance: 75,
    },
    {
      userId: "3",
      name: "Alice Johnson",
      address: "789 Oak Ave, Capital City, USA",
      subscriptionType: "Monthly Cheese",
      walletBalance: 40,
    },
  ];

  // State for deliveries, loading and error states
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For testing, load sample data on mount (simulate API call delay)
  useEffect(() => {
    const fetchData = () => {
      // Simulate network delay
      setTimeout(() => {
        setDeliveries(sampleDeliveries);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-xl font-semibold">Loading deliveries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Today's Deliveries</h1>
        <p className="text-gray-600">
          Review the scheduled deliveries for today below.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <tr
                key={delivery.userId}
                className="hover:bg-gray-100 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {delivery.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {delivery.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {delivery.subscriptionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${delivery.walletBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentDelivery;
