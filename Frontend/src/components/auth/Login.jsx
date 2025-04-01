import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login attempt with Email: " + formData.email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F8F8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <img src={"../src/assets/logo1.png"} alt="Logo" className="mx-auto h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-[#00B86C]">Login</h2>
        <p className="text-gray-600 mb-4">Enter your credentials to continue</p>
        
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
          <button type="submit" className="w-full bg-[#00B86C] text-white p-3 rounded-lg hover:bg-[#78905D] font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;