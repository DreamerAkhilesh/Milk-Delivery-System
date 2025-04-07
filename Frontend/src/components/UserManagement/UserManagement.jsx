import React from "react";
import UserCard from "./UserCard";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Navbar from "../shared/Navbar";

const dummyUsers = [
  {
    id: 1,
    name: "Akhilesh",
    email: "akhil@example.com",
    wallet: 150.5,
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    wallet: 0,
  },
];

const UserList = () => {
  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleDelete = (user) => {
    console.log("Delete user:", user);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleTransaction = (user) => {
    console.log("Transaction for user:", user);
  };

  const handleNotification = (user) => {
    console.log("Send notification to user:", user);
  };

  const handleWallet = (user) => {
    console.log("Wallet balance for user:", user.wallet);
  };

  return (
    <>
    <Navbar />
    <div className="space-y-4 p-6 max-w-3xl mx-auto">
      {dummyUsers.map((user) => (
        <div key={user.id} className="relative">
          <Dialog>
            <UserCard
              user={user}
              onView={handleView}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onTransaction={handleTransaction}
              onNotification={handleNotification}
              onWallet={handleWallet}
            />
            <div className="absolute top-4 right-4">
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="bg-white shadow-lg rounded-xl p-6">
              <div className="space-y-3">
                <Button onClick={() => handleWallet(user)} className="w-full">Wallet Balance</Button>
                <Button onClick={() => handleTransaction(user)} className="w-full">Transaction</Button>
                <Button onClick={() => handleNotification(user)} className="w-full">Notification</Button>
                <Button onClick={() => handleEdit(user)} className="w-full">Edit</Button>
                <Button onClick={() => handleDelete(user)} variant="destructive" className="w-full">Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
    </>
    );
};

export default UserList;
