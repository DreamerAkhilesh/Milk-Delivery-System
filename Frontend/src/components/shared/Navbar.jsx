import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X, LogOut, User2 } from "lucide-react";
import axios from "axios";
import { logoutUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { USER_API_END_POINT, ADMIN_API_END_POINT } from "../../utils/constant";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const apiEndpoint = user?.role === "admin" ? ADMIN_API_END_POINT : USER_API_END_POINT;
      
      const res = await axios.get(`${apiEndpoint}/logout`, {
        withCredentials: true,
        headers: {
          Authorization: user?.role === "admin" ? 
            localStorage.getItem("adminToken") : 
            localStorage.getItem("token")
        }
      });

      if (user?.role === "admin") {
        localStorage.removeItem("adminToken");
      } else {
        localStorage.removeItem("token");
      }

      dispatch(logoutUser());

      navigate("/home");

      toast.success(res.data.message || "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
      
      dispatch(logoutUser());
      if (user?.role === "admin") {
        localStorage.removeItem("adminToken");
      } else {
        localStorage.removeItem("token");
      }
      navigate("/home");
    }
  };

  const renderPopoverContent = () => {
    return (
      <PopoverContent className="w-64">
        <div className="flex items-center space-x-3 p-2">
          <Avatar>
            <AvatarImage
              src={user?.profile?.profilePhoto}
              alt="Profile"
            />
            <AvatarFallback className="bg-gray-200">
              <User2 className="h-5 w-5 text-gray-600" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-700">{user?.name || "User"}</span>
        </div>
        <div className="mt-4 text-gray-600">
          {user?.role !== "admin" && (
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
              <User2 className="h-5 w-5" />
              <Link to="/profile" className="flex-grow no-underline text-gray-600 hover:text-gray-900">
                My Profile
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <LogOut className="h-5 w-5" />
            <button onClick={logoutHandler} className="flex-grow text-left text-gray-600 hover:text-gray-900 bg-transparent border-none p-0 m-0 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </PopoverContent>
    );
  };

  return (
    <nav className="bg-white shadow-md p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src="../src/assets/logo1.png" alt="Logo" className="h-12" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          <ul className="flex space-x-6 text-gray-700">
            {user?.role === "admin" ? (
              <>
                <li>
                  <Link
                    to="/admin/products"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/subscriptions"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Subscriptions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/transactions"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Transactions
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#8CE0FC] cursor-pointer">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#8CE0FC] cursor-pointer"
                  >
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="ml-6 flex items-center space-x-4">
            {!user ? (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-[#8CE0FC]">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gray-200">
                      <User2 className="h-5 w-5 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                {renderPopoverContent()}
              </Popover>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 p-6 flex flex-col items-center space-y-4 md:hidden">
          {user?.role === "admin" ? (
            <>
              <Link
                to="/admin/products"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Products
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Users
              </Link>
              <Link
                to="/admin/subscriptions"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Subscriptions
              </Link>
              <Link
                to="/admin/transactions"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Transactions
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#8CE0FC]"
              >
                Contact
              </Link>
            </>
          )}

          {!user ? (
            <div className="flex flex-col space-y-2 w-full">
              <Link
                to="/login"
                className="w-full text-center border rounded-lg py-2 hover:text-[#8CE0FC]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full text-center bg-blue-600 text-white rounded-lg py-2 hover:bg-[#8CE0FC]"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logoutHandler();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 hover:text-[#8CE0FC]"
            >
              <LogOut />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
