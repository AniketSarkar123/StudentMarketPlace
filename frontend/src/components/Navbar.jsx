import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  // Helper to retrieve a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userInfo));
        setLoggedIn(true);
        // Check if the flag field is set to true
        if (parsed.flag === true) {
          setShowRequest(true);
        } else {
          setShowRequest(false);
        }
      } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
        setLoggedIn(false);
        setShowRequest(false);
      }
    } else {
      setLoggedIn(false);
      setShowRequest(false);
    }
  }, [location]);

  // Function to handle logout: destroys the cookie and redirects to login
  const handleLogout = () => {
    document.cookie = 'userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLoggedIn(false);
    setShowRequest(false);
    navigate('/login');
  };

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
            {/* Render Home link only if logged in */}
            {loggedIn && (
              <Link
                to="/home"
                className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
              >
                Home
              </Link>
            )}
            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`${isActive('/profile')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Profile
                </Link>
                <Link
                  to="/add-item"
                  className={`${isActive('/add-item')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Add Item
                </Link>
                <Link to="/cart" className={`${isActive('/cart')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>
                  View Cart
                </Link>
                <Link to="/delivery" className={`${isActive('/delivery')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>
                  Delivery
                </Link>
                {/* Show the Request link only if the flag is true */}
                {showRequest && (
                  <Link to="/request" className={`${isActive('/request')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}>
                    Request
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
