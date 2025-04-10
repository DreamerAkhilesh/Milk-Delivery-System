import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constant";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerAdmin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/register`, formData);
      alert(response.data.message);
      navigate("/admin/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F8F8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <img
          src={"../src/assets/logo1.png"}
          alt="Logo"
          className="mx-auto h-16 mb-4"
        />
        <h2 className="text-2xl font-bold mb-4 text-[#00B86C]">Admin Register</h2>
        <p className="text-gray-600 mb-4">Only authorized admins can register</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            required
          />
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
            type="button"
            className="w-full bg-[#00B86C] text-white p-3 rounded-lg hover:bg-[#78905D] font-semibold"
            onClick={registerAdmin}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Admin"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-[#00B86C] font-medium hover:underline">
            Login as Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
