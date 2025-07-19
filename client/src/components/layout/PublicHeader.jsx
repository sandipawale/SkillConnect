// Import Link and NavLink components from react-router-dom for navigation
import { Link, NavLink } from 'react-router-dom';

// Define the PublicHeader functional component
const PublicHeader = () => {
  return (
    // Header with background color, fixed positioning, and shadow
    <header className="bg-primary-dark fixed top-0 left-0 right-0 z-10 shadow-md">
      {/* Navigation bar container with spacing and alignment */}
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo or brand name linking to the home page */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
          SkillConnect
        </Link>
        {/* Navigation links for Login and Register */}
        <div className="flex items-center space-x-2">
          {/* Login button styled as a NavLink */}
          <NavLink
            to="/login"
            className="px-4 py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-opacity-90"
          >
            Login
          </NavLink>
          {/* Register button styled as a NavLink */}
          <NavLink
            to="/register"
            className="px-4 py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-opacity-90"
          >
            Register
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
// Export the PublicHeader component as default
export default PublicHeader;