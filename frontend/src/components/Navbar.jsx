import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">StudentMarket</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`${isActive('/login')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${isActive('/signup')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar