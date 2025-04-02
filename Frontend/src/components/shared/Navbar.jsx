import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, LogOut, User2 } from "lucide-react";
import { logoutUser } from "@/redux/authSlice"; // Import logout action
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser()); // Update Redux
    toast.success("Logged out successfully");
    navigate("/"); // Redirect to home
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src="../src/assets/logo1.png" alt="Logo" className="h-12" />
        </Link>

        <div className="hidden md:flex items-center space-x-6 ml-auto">
          <ul className="flex space-x-6 text-gray-700">
            <li><Link to="/" className="hover:text-[#00B86C] cursor-pointer">Home</Link></li>
            <li><Link to="/products" className="hover:text-[#00B86C] cursor-pointer">Products</Link></li>
            <li><Link to="/about" className="hover:text-[#00B86C] cursor-pointer">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#00B86C] cursor-pointer">Contact</Link></li>
          </ul>

          <div className="ml-6 flex items-center space-x-4">
            {!user ? (
              <div className="flex space-x-3">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button className="bg-blue-600 text-white hover:bg-[#00B86C]">Signup</Button></Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                    <AvatarFallback><User2 size={24} /></AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                      <AvatarFallback><User2 size={24} /></AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.name}</h4>
                      {/* <p className="text-sm text-gray-500">{user?.profile?.bio}</p> */}
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600">
                    <div className="flex flex-col gap-2 cursor-pointer">
                      <Link to="/profile" className="flex items-center gap-2 hover:text-[#00B86C]">
                        <User2 /> Profile
                      </Link>
                      <div className="flex items-center gap-2 hover:text-red-600" onClick={logoutHandler}>
                        <LogOut /> Logout
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;