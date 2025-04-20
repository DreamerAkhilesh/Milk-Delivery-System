import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/authSlice"; // Import Redux action
import { USER_API_END_POINT } from "../../utils/constant";
import { logAuthStatus } from "../../utils/authLogger";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); // Get Redux dispatch function
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);
  
  // Log auth state on component mount
  useEffect(() => {
    console.log("Login component mounted, current auth state:", authState);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Login attempt with:", formData.email);

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, formData);
      console.log("Login response received:", res);
      
      // Extract user data from the nested response structure
      let userData;
      
      // Handle different possible response structures
      if (res.data.data) {
        // New response format: { success, statusCode, message, data }
        console.log("New response format detected, data:", res.data.data);
        userData = res.data.data.user || res.data.data;
      } else if (res.data.user) {
        // Old response format: { message, user, token }
        console.log("Old response format detected, user:", res.data.user);
        userData = res.data.user;
      } else {
        console.error("Unexpected response format:", res.data);
        setError("Unexpected response format from server");
        setLoading(false);
        return;
      }
      
      // Get token from appropriate location in response
      const token = res.data.data?.token || res.data.token;
      
      if (!userData) {
        console.error("Could not extract user data from response:", res.data);
        setError("Could not extract user data from response");
        setLoading(false);
        return;
      }
      
      console.log("User data extracted from response:", userData);
      
      // Add role property if it doesn't exist (for authSlice logic)
      if (!userData.role) {
        userData.role = "user";
      }
      
      // Dispatch user data to Redux
      console.log("Dispatching user data to Redux:", userData);
      dispatch(setUser(userData));
      
      // Store token securely
      if (token) {
        console.log("Storing auth token");
        localStorage.setItem("token", token);
      } else {
        console.warn("No token found in response");
      }
      
      // Log auth status after a small delay to allow state update
      setTimeout(() => {
        console.log("Checking auth status after login:");
        logAuthStatus();
      }, 500);
      
      // Navigate to home page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F8F8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <img src={"../src/assets/logo1.png"} alt="Logo" className="mx-auto h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-[#00B86C]">Login</h2>
        <p className="text-gray-600 mb-4">Enter your credentials to continue</p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#00B86C] text-white p-3 rounded-lg hover:bg-[#78905D] font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-4">
          <button 
            className="text-sm text-gray-600 hover:text-[#00B86C]"
            onClick={() => {
              console.log("Manually checking auth status:");
              logAuthStatus();
            }}
          >
            Check login status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
