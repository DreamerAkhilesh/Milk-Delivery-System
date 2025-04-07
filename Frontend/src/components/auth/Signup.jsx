import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import Axios for HTTP requests
import { USER_API_END_POINT } from '../../utils/constant'; // API endpoint constant

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      // Send OTP request to the backend
      console.log("OTP Send") ;
      await axios.post(`${USER_API_END_POINT}/send-otp`, { email: formData.email });
      setOtpSent(true); // OTP sent successfully
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  const verifyAndRegister = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      // Send registration request to the backend with the OTP
      const response = await axios.post(`${USER_API_END_POINT}/register`, {
        ...formData,
        otp,
      });

      setOtpVerified(true); // OTP verified successfully
      console.log("Registration successful:", response.data);
      alert("Registration successful!");

      // ✅ Redirect to home page after successful registration
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Invalid or expired OTP, please try again.");
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
        <h2 className="text-2xl font-bold mb-4 text-[#00B86C]">Signup</h2>
        <p className="text-gray-600 mb-4">Enter your details to continue</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
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
          />
          <input
            type="text"
            name="address"
            placeholder="Address (Optional)"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />

          {!otpSent ? (
            <button
              type="button"
              className="w-full bg-[#00B86C] text-white p-3 rounded-lg hover:bg-[#78905D] font-semibold"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Generate OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                className="w-full bg-[#00B86C] text-white p-3 rounded-lg hover:bg-[#78905D] font-semibold"
                onClick={verifyAndRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
