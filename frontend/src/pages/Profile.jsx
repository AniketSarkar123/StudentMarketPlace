import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper: Fetch balance from backend given a userId (from query param)
async function fetchBalance(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/get_bal?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

// StarRating Component: Fetches and displays seller's rating as stars.
// It shows filled stars ("★") for selected rating and outlined stars ("☆") for the remainder.
// When a star is clicked, that many stars are "lit" and can be submitted.
const StarRating = ({ sellerId }) => {
  const [rating, setRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    async function fetchRating() {
      try {
        const response = await fetch(`http://localhost:3000/ratings/get?sellerId=${sellerId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
          setRating(data.averageRating);
          setSelectedRating(Math.round(data.averageRating));
        } else {
          setRating(0);
          setSelectedRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(0);
        setSelectedRating(0);
      }
    }
    fetchRating();
  }, [sellerId]);

  const submitRating = async () => {
    try {
      const response = await fetch("http://localhost:3000/ratings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, points: selectedRating }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Error rating seller");
      } else {
        toast.success("Seller rated successfully!");
      }
    } catch (error) {
      console.error("Error rating seller:", error);
      toast.error("An error occurred while rating seller.");
    }
  };

  if (rating === null) return <span>Loading rating...</span>;

  return (
    <div>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setSelectedRating(star)}
            style={{ fontSize: "1.5rem", cursor: "pointer", marginRight: "5px" }}
          >
            {star <= selectedRating ? "★" : "☆"}
          </span>
        ))}
        <button onClick={submitRating} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded">
          Submit Rating
        </button>
      </div>
      <div className="text-sm text-gray-600">(Avg: {rating.toFixed(1)})</div>
    </div>
  );
};

function Profile() {
  const navigate = useNavigate();

  // State for user info
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 'Student',
    balance: 0,
    about: '',
  });
  
  // States for editing fields
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAbout, setNewAbout] = useState('');

  // State for Add Balance UI
  const [addBalanceMode, setAddBalanceMode] = useState(false);
  const [balanceToAdd, setBalanceToAdd] = useState('');

  // State for orders list
  const [orders, setOrders] = useState([]);

  // State for rating: which seller we are rating (if needed, but here we show rating for each seller in each order)
  // For this implementation, we'll render a StarRating component for every unique seller in an order.

  // Load user info and orders on mount
  useEffect(() => {
    loadUserInfo();
    loadOrders();
  }, []);

  // Async function to load user info from cookie and update balance from backend
  async function loadUserInfo() {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const fetchedBalance = await fetchBalance(parsed.userId);
        setUser({
          username: parsed.username || 'Unknown',
          email: parsed.usermail || 'No Email',
          role: 'Student',
          balance: fetchedBalance,
          about: parsed.about || 'This is your about section. Click edit to modify.',
        });
      } catch (error) {
        console.error('Error parsing userInfo cookie:', error);
      }
    }
  }

  // Function to allow Charity account
  const handleRequestDonation = async () => {
    const rawUserInfo = getCookie('userInfo');
    if (!rawUserInfo) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
      const response = await fetch(`http://localhost:3000/users/donation?userId=${parsed.userId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Donation status ACTIVE");
      } else {
        toast.error(data.error || "Failed to update donation status");
      }
    } catch (error) {
      console.error("Error setting donation status", error);
      toast.error("An error occurred while setting donation status");
    }
  };

  // Function to load orders for the logged-in user using user_id as a query parameter
  async function loadOrders() {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const response = await fetch(`http://localhost:3000/orders/get?user_id=${parsed.userId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    }
  }

  // Handlers for edit mode
  const handleEditClick = () => {
    setEditMode(true);
    setNewEmail(user.email);
    setNewPassword('');
    setNewAbout(user.about);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewEmail('');
    setNewPassword('');
    setNewAbout('');
  };

  const handleSave = async () => {
    if (!newEmail || !newPassword) {
      toast.error('Please provide both a new email and password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          about: newAbout,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error updating user info');
      } else {
        toast.success('User info updated successfully');
        setUser((prev) => ({
          ...prev,
          email: newEmail,
          about: newAbout,
        }));
        setEditMode(false);
        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify({ ...user, email: newEmail, about: newAbout })
        )}; path=/;`;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating user info.');
    }
  };

  // Handlers for Add Balance
  const handleToggleAddBalance = () => {
    setAddBalanceMode((prev) => !prev);
    setBalanceToAdd('');
  };

  const handleAddBalance = async () => {
    if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/users/add_balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: Number(balanceToAdd),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Error updating balance');
      } else {
        toast.success('Balance added successfully');
        setUser((prev) => ({
          ...prev,
          balance: data.balance,
        }));
        setAddBalanceMode(false);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('An error occurred while updating balance.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="bg-blue-600 rounded-lg text-white p-6">
          <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
            {user.username ? user.username[0].toUpperCase() : '??'}
          </div>
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-md mb-1">{user.role}</p>
          <p className="text-md mb-4">{user.email}</p>
          <div className="border-t border-blue-300 pt-4">
            <h3 className="font-semibold text-lg">Current Balance</h3>
            <p className="text-xl">Rs.{user.balance}</p>
            <button onClick={handleToggleAddBalance} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {addBalanceMode ? "Cancel" : "Add Balance"}
            </button>
            {addBalanceMode && (
              <div className="mt-2">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={balanceToAdd}
                  onChange={(e) => setBalanceToAdd(e.target.value)}
                  className="p-2 rounded border border-gray-300"
                />
                <button onClick={handleAddBalance} className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            )}
            <button onClick={loadUserInfo} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Refresh Profile
            </button>
            <button onClick={handleRequestDonation} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              Request Donation
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Profile</h3>
            {!editMode && (
              <button onClick={handleEditClick} className="text-lg bg-blue-600 text-white px-4 py-2 rounded">
                Edit
              </button>
            )}
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="text-xl font-medium">About</h4>
              {editMode ? (
                <textarea
                  value={newAbout}
                  onChange={(e) => setNewAbout(e.target.value)}
                  className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
                  rows="4"
                />
              ) : (
                <p className="text-lg text-gray-600 mt-2">{user.about}</p>
              )}
            </div>
            <div>
              <h4 className="text-xl font-medium">Orders</h4>
              {orders.length === 0 ? (
                <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
              ) : (
                <div className="mt-2 space-y-4">
                  {orders.map((order) => {
                    // Compute unique seller IDs for this order
                    const uniqueSellerIds = [
                      ...new Set(order.items.map((item) => item.seller_id)),
                    ];
                    return (
                      <div key={order.id} className="p-4 border rounded">
                        <h5 className="text-lg font-bold">Order #{order.order_id}</h5>
                        <p>Total: Rs. {order.total_price}</p>
                        {order.delivery_address && <p>Delivery Address: {order.delivery_address}</p>}
                        <div className="mt-2">
                          <h5 className="text-lg font-semibold">Rate Seller(s):</h5>
                          {uniqueSellerIds.map((sellerId) => (
                            <div key={sellerId} className="mt-2">
                              <p className="text-sm">Seller ID: {sellerId}</p>
                              <StarRating sellerId={sellerId} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button onClick={loadOrders} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Refresh Orders
              </button>
            </div>
            {editMode && (
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">New Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded text-lg">
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
