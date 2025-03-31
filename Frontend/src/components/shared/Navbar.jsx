import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="texty-white text-xl font-bold">MyApp</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          </li>
          <li>
            <Link to="/product" className="text-white hover:text-gray-200">Product</Link>
          </li>
          <li>
            <Link to="/signup" className="text-white hover:text-gray-200">Signup/Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;