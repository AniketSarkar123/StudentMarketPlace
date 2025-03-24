import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Helper to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function Profile() {
  const navigate = useNavigate();

  // State for user info including an about field
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 'Student',
    balance: 0,
    about: '',
  });

  // State for editing fields: email, password and about
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAbout, setNewAbout] = useState('');

  // On component mount, fetch or parse user info from cookie (or from an API)
  useEffect(() => {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        setUser({
          username: parsed.username || 'Unknown',
          email: parsed.usermail || 'No Email',
          role: 'Student',
          balance: parsed.balance || 0,
          about: parsed.about || 'This is your about section. Click edit to modify.',
        });
      } catch (error) {
        console.error('Error parsing userInfo cookie:', error);
      }
    }
  }, []);

  // Handler for enabling edit mode
  const handleEditClick = () => {
    setEditMode(true);
    setNewEmail(user.email);
    setNewPassword('');
    setNewAbout(user.about);
  };

  // Handler for cancelling edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setNewEmail('');
    setNewPassword('');
    setNewAbout('');
  };

  // Handler for submitting updated email, password and about info
  const handleSave = async () => {
    if (!newEmail || !newPassword) {
      toast.error('Please provide both a new email and password.');
      return;
    }

    try {
      // Example PUT request to update user info
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
        // Update local state with new email and about info; username remains unchanged
        setUser((prev) => ({
          ...prev,
          email: newEmail,
          about: newAbout,
        }));
        setEditMode(false);

        // Optionally update the cookie with new user info. Assuming the updated info is in data.user.
        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify({
            ...data.user,
            username: user.username, // Keep the original username
            balance: user.balance,   // Keep balance unchanged unless updated by response
          })
        )}; path=/;`;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating user info.');
    }
  };

  // Compute user’s initials from username
  const getInitials = () => {
    if (!user.username) return '??';
    return user.username
      .split(' ')
      .map((namePart) => namePart[0]?.toUpperCase())
      .join('');
  };

  return (
    <div className="max-w-7xl mx-auto my-10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="bg-blue-600 rounded-lg text-white p-6">
          {/* User Avatar or Initials */}
          <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
            {getInitials()}
          </div>
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-md mb-1">{user.role}</p>
          <p className="text-md mb-4">{user.email}</p>

          <div className="border-t border-blue-300 pt-4">
            <h3 className="font-semibold text-lg">Current Balance</h3>
            <p className="text-xl">${user.balance}</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          {/* Header with Edit Button */}
          <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Profile</h3>
            {!editMode && (
              <button
                onClick={handleEditClick}
                className="text-lg bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {/* About Section */}
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

            {/* Orders Section */}
            <div>
              <h4 className="text-xl font-medium">Orders</h4>
              <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
            </div>

            {/* Edit Fields for Email and Password */}
            {editMode && (
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg"
                  >
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
