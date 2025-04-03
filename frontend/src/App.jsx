import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddItem from './components/addItem.jsx'; // Adjust path if needed
import EditItem from './pages/Edit.jsx';
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx'; // New Cart page
import { CartProvider } from './context/CartContext'; // New Cart context provider
import Delivery from './pages/Delivery.jsx';
import Comments from './pages/Comments.jsx';
import RequestItems from './pages/RequestItems.jsx';
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/edit" element={<EditItem />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/request" element={<RequestItems />} />
          </Routes>
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
