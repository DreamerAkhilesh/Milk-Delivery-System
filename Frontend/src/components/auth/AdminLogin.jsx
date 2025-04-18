import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../../redux/authSlice";
import { ADMIN_API_END_POINT } from "../../utils/constant";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email: formData.email });
      const res = await axios.post(`${ADMIN_API_END_POINT}/login`, formData);
      console.log('Login response:', res.data);
      
      // Check if we have the expected nested data structure
      if (!res.data?.data?.token) {
        console.error('Invalid response format:', res.data);
        setError("Invalid response from server");
        return;
      }

      // Store the token
      localStorage.setItem("adminToken", res.data.data.token);
      console.log('Token stored in localStorage');
      
      // Create admin object from response
      const adminData = {
        id: res.data.data.admin?.id || '',
        name: res.data.data.admin?.name || '',
        email: res.data.data.admin?.email || '',
        role: "admin",
        token: res.data.data.token
      };
      
      // Store admin data in localStorage
      localStorage.setItem("adminData", JSON.stringify(adminData));
      console.log('Admin data stored in localStorage:', adminData);
      
      // Update Redux state
      dispatch(setUser(adminData));
      console.log('Redux state updated with admin data');
      
      // Navigate to admin dashboard
      navigate("/admin/dashboard");
      
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Please provide both email and password");
      } else if (!err.response) {
        setError("Could not connect to the server. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Login failed, try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F8F8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <img src={"../src/assets/logo1.png"} alt="Logo" className="mx-auto h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-[#00B86C]">Admin Login</h2>
        <p className="text-gray-600 mb-4">Enter your admin credentials</p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
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
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Not registered yet?{" "}
          <Link to="/admin/register" className="text-[#00B86C] font-medium hover:underline">
            Register as Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
