import React from "react";

const UserCard = ({ user }) => {
  const isActive = user.wallet > 0;

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
        <p className="mt-1 text-sm">
          Wallet: ₹{user.wallet.toFixed(2)} —{" "}
          <span className={isActive ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
            {isActive ? "Active" : "Paused"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
