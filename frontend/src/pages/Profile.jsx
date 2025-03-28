// // // import React, { useState, useEffect } from 'react';
// // // import toast from 'react-hot-toast';
// // // import { useNavigate } from 'react-router-dom';

// // // // Helper to get a cookie by name
// // // function getCookie(name) {
// // //   const value = `; ${document.cookie}`;
// // //   const parts = value.split(`; ${name}=`);
// // //   if (parts.length === 2) return parts.pop().split(';').shift();
// // //   return null;
// // // }

// // // function Profile() {
// // //   const navigate = useNavigate();

// // //   // State for user info including an about field
// // //   const [user, setUser] = useState({
// // //     username: '',
// // //     email: '',
// // //     role: 'Student',
// // //     balance: 0,
// // //     about: '',
// // //   });

// // //   // State for editing fields: email, password and about
// // //   const [editMode, setEditMode] = useState(false);
// // //   const [newEmail, setNewEmail] = useState('');
// // //   const [newPassword, setNewPassword] = useState('');
// // //   const [newAbout, setNewAbout] = useState('');

// // //   // On component mount, fetch or parse user info from cookie (or from an API)
// // //   useEffect(() => {
// // //     const rawUserInfo = getCookie('userInfo');
// // //     if (rawUserInfo) {
// // //       try {
// // //         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
// // //         setUser({
// // //           username: parsed.username || 'Unknown',
// // //           email: parsed.usermail || 'No Email',
// // //           role: 'Student',
// // //           balance: parsed.balance || 0,
// // //           about: parsed.about || 'This is your about section. Click edit to modify.',
// // //         });
// // //       } catch (error) {
// // //         console.error('Error parsing userInfo cookie:', error);
// // //       }
// // //     }
// // //   }, []);

// // //   // Handler for enabling edit mode
// // //   const handleEditClick = () => {
// // //     setEditMode(true);
// // //     setNewEmail(user.email);
// // //     setNewPassword('');
// // //     setNewAbout(user.about);
// // //   };

// // //   // Handler for cancelling edit
// // //   const handleCancelEdit = () => {
// // //     setEditMode(false);
// // //     setNewEmail('');
// // //     setNewPassword('');
// // //     setNewAbout('');
// // //   };

// // //   // Handler for submitting updated email, password and about info
// // //   const handleSave = async () => {
// // //     if (!newEmail || !newPassword) {
// // //       toast.error('Please provide both a new email and password.');
// // //       return;
// // //     }

// // //     try {
// // //       // Example PUT request to update user info
// // //       const response = await fetch('http://localhost:3000/users/update', {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         credentials: 'include',
// // //         body: JSON.stringify({
// // //           email: newEmail,
// // //           password: newPassword,
// // //           about: newAbout,
// // //         }),
// // //       });

// // //       const data = await response.json();
// // //       if (!response.ok) {
// // //         toast.error(data.error || 'Error updating user info');
// // //       } else {
// // //         toast.success('User info updated successfully');
// // //         // Update local state with new email and about info; username remains unchanged
// // //         setUser((prev) => ({
// // //           ...prev,
// // //           email: newEmail,
// // //           about: newAbout,
// // //         }));
// // //         setEditMode(false);

// // //         // Optionally update the cookie with new user info. Assuming the updated info is in data.user.
// // //         document.cookie = `userInfo=${encodeURIComponent(
// // //           JSON.stringify({
// // //             ...data.user,
// // //             username: user.username, // Keep the original username
// // //             balance: user.balance,   // Keep balance unchanged unless updated by response
// // //           })
// // //         )}; path=/;`;
// // //       }
// // //     } catch (error) {
// // //       console.error('Error:', error);
// // //       toast.error('An error occurred while updating user info.');
// // //     }
// // //   };

// // //   // Compute user’s initials from username
// // //   const getInitials = () => {
// // //     if (!user.username) return '??';
// // //     return user.username
// // //       .split(' ')
// // //       .map((namePart) => namePart[0]?.toUpperCase())
// // //       .join('');
// // //   };

// // //   return (
// // //     <div className="max-w-7xl mx-auto my-10 p-6">
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //         {/* Left Panel */}
// // //         <div className="bg-blue-600 rounded-lg text-white p-6">
// // //           {/* User Avatar or Initials */}
// // //           <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
// // //             {getInitials()}
// // //           </div>
// // //           <h2 className="text-2xl font-semibold">{user.username}</h2>
// // //           <p className="text-md mb-1">{user.role}</p>
// // //           <p className="text-md mb-4">{user.email}</p>

// // //           <div className="border-t border-blue-300 pt-4">
// // //             <h3 className="font-semibold text-lg">Current Balance</h3>
// // //             <p className="text-xl">${user.balance}</p>
// // //           </div>
// // //         </div>

// // //         {/* Right Panel */}
// // //         <div className="col-span-2 bg-white rounded-lg shadow p-6">
// // //           {/* Header with Edit Button */}
// // //           <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
// // //             <h3 className="text-2xl font-semibold">Profile</h3>
// // //             {!editMode && (
// // //               <button
// // //                 onClick={handleEditClick}
// // //                 className="text-lg bg-blue-600 text-white px-4 py-2 rounded"
// // //               >
// // //                 Edit
// // //               </button>
// // //             )}
// // //           </div>

// // //           <div className="mt-6 space-y-6">
// // //             {/* About Section */}
// // //             <div>
// // //               <h4 className="text-xl font-medium">About</h4>
// // //               {editMode ? (
// // //                 <textarea
// // //                   value={newAbout}
// // //                   onChange={(e) => setNewAbout(e.target.value)}
// // //                   className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// // //                   rows="4"
// // //                 />
// // //               ) : (
// // //                 <p className="text-lg text-gray-600 mt-2">{user.about}</p>
// // //               )}
// // //             </div>

// // //             {/* Orders Section */}
// // //             <div>
// // //               <h4 className="text-xl font-medium">Orders</h4>
// // //               <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
// // //             </div>

// // //             {/* Edit Fields for Email and Password */}
// // //             {editMode && (
// // //               <div className="bg-gray-50 p-6 rounded-md">
// // //                 <div className="mb-4">
// // //                   <label className="block text-lg font-medium text-gray-700">
// // //                     New Email
// // //                   </label>
// // //                   <input
// // //                     type="email"
// // //                     value={newEmail}
// // //                     onChange={(e) => setNewEmail(e.target.value)}
// // //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// // //                   />
// // //                 </div>
// // //                 <div className="mb-4">
// // //                   <label className="block text-lg font-medium text-gray-700">
// // //                     New Password
// // //                   </label>
// // //                   <input
// // //                     type="password"
// // //                     value={newPassword}
// // //                     onChange={(e) => setNewPassword(e.target.value)}
// // //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// // //                   />
// // //                 </div>
// // //                 <div className="flex space-x-4 mt-6">
// // //                   <button
// // //                     onClick={handleSave}
// // //                     className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
// // //                   >
// // //                     Save
// // //                   </button>
// // //                   <button
// // //                     onClick={handleCancelEdit}
// // //                     className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg"
// // //                   >
// // //                     Cancel
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Profile;
// // // Profile.jsx
// // import React, { useState, useEffect } from 'react';
// // import toast from 'react-hot-toast';
// // import { useNavigate } from 'react-router-dom';

// // // Helper to get a cookie by name
// // function getCookie(name) {
// //   const value = `; ${document.cookie}`;
// //   const parts = value.split(`; ${name}=`);
// //   if (parts.length === 2) return parts.pop().split(';').shift();
// //   return null;
// // }

// // function Profile() {
// //   const navigate = useNavigate();

// //   // State for user info including an about field
// //   const [user, setUser] = useState({
// //     username: '',
// //     email: '',
// //     role: 'Student',
// //     balance: 0,
// //     about: '',
// //   });

// //   // State for editing fields: email, password and about
// //   const [editMode, setEditMode] = useState(false);
// //   const [newEmail, setNewEmail] = useState('');
// //   const [newPassword, setNewPassword] = useState('');
// //   const [newAbout, setNewAbout] = useState('');

// //   // State for Add Balance UI
// //   const [addBalanceMode, setAddBalanceMode] = useState(false);
// //   const [balanceToAdd, setBalanceToAdd] = useState('');

// //   // On component mount, fetch or parse user info from cookie (or from an API)
// //   useEffect(() => {
// //     const rawUserInfo = getCookie('userInfo');
// //     if (rawUserInfo) {
// //       try {
// //         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
// //         setUser({
// //           username: parsed.username || 'Unknown',
// //           email: parsed.usermail || 'No Email',
// //           role: 'Student',
// //           balance: parsed.balance || 0,
// //           about: parsed.about || 'This is your about section. Click edit to modify.',
// //         });
// //       } catch (error) {
// //         console.error('Error parsing userInfo cookie:', error);
// //       }
// //     }
// //   }, []);

// //   // Handler for enabling edit mode
// //   const handleEditClick = () => {
// //     setEditMode(true);
// //     setNewEmail(user.email);
// //     setNewPassword('');
// //     setNewAbout(user.about);
// //   };

// //   // Handler for cancelling edit
// //   const handleCancelEdit = () => {
// //     setEditMode(false);
// //     setNewEmail('');
// //     setNewPassword('');
// //     setNewAbout('');
// //   };

// //   // Handler for submitting updated email, password and about info
// //   const handleSave = async () => {
// //     if (!newEmail || !newPassword) {
// //       toast.error('Please provide both a new email and password.');
// //       return;
// //     }
// //     try {
// //       const response = await fetch('http://localhost:3000/users/update', {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({
// //           email: newEmail,
// //           password: newPassword,
// //           about: newAbout,
// //         }),
// //       });

// //       const data = await response.json();
// //       if (!response.ok) {
// //         toast.error(data.error || 'Error updating user info');
// //       } else {
// //         toast.success('User info updated successfully');
// //         setUser((prev) => ({
// //           ...prev,
// //           email: newEmail,
// //           about: newAbout,
// //         }));
// //         setEditMode(false);

// //         // Optionally update the cookie with new user info.
// //         document.cookie = `userInfo=${encodeURIComponent(
// //           JSON.stringify({
// //             ...data.user,
// //             username: user.username,
// //             balance: user.balance,
// //           })
// //         )}; path=/;`;
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //       toast.error('An error occurred while updating user info.');
// //     }
// //   };

// //   // Handler to toggle the Add Balance UI
// //   const handleToggleAddBalance = () => {
// //     setAddBalanceMode((prev) => !prev);
// //     setBalanceToAdd('');
// //   };

// //   // Handler for submitting the additional balance amount
// //   const handleAddBalance = async () => {
// //     if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
// //       toast.error('Please enter a valid amount.');
// //       return;
// //     }
// //     try {
// //       // Call the new route to add balance.
// //       const response = await fetch('http://localhost:3000/users/add_balance', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({
// //           userId: user.userId,
// //           amount: Number(balanceToAdd),
// //         }),
// //       });
// //       const data = await response.json();
// //       if (!response.ok) {
// //         toast.error(data.error || 'Error updating balance');
// //       } else {
// //         toast.success('Balance added successfully');
// //         // Update the local state with the new balance.
// //         setUser((prev) => ({
// //           ...prev,
// //           balance: data.balance,
// //         }));
// //         setAddBalanceMode(false);
// //         // Optionally, update the cookie with new balance info.
// //         document.cookie = `userInfo=${encodeURIComponent(
// //           JSON.stringify({
// //             ...data.user,
// //             username: user.username,
// //             balance: data.balance,
// //           })
// //         )}; path=/;`;
// //       }
// //     } catch (error) {
// //       console.error('Error updating balance:', error);
// //       toast.error('An error occurred while updating balance.');
// //     }
// //   };

// //   // Compute user’s initials from username
// //   const getInitials = () => {
// //     if (!user.username) return '??';
// //     return user.username
// //       .split(' ')
// //       .map((namePart) => namePart[0]?.toUpperCase())
// //       .join('');
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto my-10 p-6">
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         {/* Left Panel */}
// //         <div className="bg-blue-600 rounded-lg text-white p-6">
// //           <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
// //             {getInitials()}
// //           </div>
// //           <h2 className="text-2xl font-semibold">{user.username}</h2>
// //           <p className="text-md mb-1">{user.role}</p>
// //           <p className="text-md mb-4">{user.email}</p>

// //           <div className="border-t border-blue-300 pt-4">
// //             <h3 className="font-semibold text-lg">Current Balance</h3>
// //             <p className="text-xl">${user.balance}</p>
// //             {/* Add Balance Button */}
// //             <button
// //               onClick={handleToggleAddBalance}
// //               className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
// //             >
// //               {addBalanceMode ? "Cancel" : "Add Balance"}
// //             </button>
// //             {/* Add Balance Input UI */}
// //             {addBalanceMode && (
// //               <div className="mt-2">
// //                 <input
// //                   type="number"
// //                   placeholder="Enter amount"
// //                   value={balanceToAdd}
// //                   onChange={(e) => setBalanceToAdd(e.target.value)}
// //                   className="p-2 rounded border border-gray-300"
// //                 />
// //                 <button
// //                   onClick={handleAddBalance}
// //                   className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
// //                 >
// //                   Submit
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Right Panel */}
// //         <div className="col-span-2 bg-white rounded-lg shadow p-6">
// //           <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
// //             <h3 className="text-2xl font-semibold">Profile</h3>
// //             {!editMode && (
// //               <button
// //                 onClick={handleEditClick}
// //                 className="text-lg bg-blue-600 text-white px-4 py-2 rounded"
// //               >
// //                 Edit
// //               </button>
// //             )}
// //           </div>

// //           <div className="mt-6 space-y-6">
// //             <div>
// //               <h4 className="text-xl font-medium">About</h4>
// //               {editMode ? (
// //                 <textarea
// //                   value={newAbout}
// //                   onChange={(e) => setNewAbout(e.target.value)}
// //                   className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   rows="4"
// //                 />
// //               ) : (
// //                 <p className="text-lg text-gray-600 mt-2">{user.about}</p>
// //               )}
// //             </div>

// //             <div>
// //               <h4 className="text-xl font-medium">Orders</h4>
// //               <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
// //             </div>

// //             {editMode && (
// //               <div className="bg-gray-50 p-6 rounded-md">
// //                 <div className="mb-4">
// //                   <label className="block text-lg font-medium text-gray-700">
// //                     New Email
// //                   </label>
// //                   <input
// //                     type="email"
// //                     value={newEmail}
// //                     onChange={(e) => setNewEmail(e.target.value)}
// //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-lg font-medium text-gray-700">
// //                     New Password
// //                   </label>
// //                   <input
// //                     type="password"
// //                     value={newPassword}
// //                     onChange={(e) => setNewPassword(e.target.value)}
// //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   />
// //                 </div>
// //                 <div className="flex space-x-4 mt-6">
// //                   <button
// //                     onClick={handleSave}
// //                     className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={handleCancelEdit}
// //                     className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Profile;
// // import React, { useState, useEffect } from 'react';
// // import toast from 'react-hot-toast';
// // import { useNavigate } from 'react-router-dom';

// // // Helper to get a cookie by name
// // function getCookie(name) {
// //   const value = `; ${document.cookie}`;
// //   const parts = value.split(`; ${name}=`);
// //   if (parts.length === 2) return parts.pop().split(';').shift();
// //   return null;
// // }

// // function Profile() {
// //   const navigate = useNavigate();

// //   // State for user info including an about field
// //   const [user, setUser] = useState({
// //     username: '',
// //     email: '',
// //     role: 'Student',
// //     balance: 0,
// //     about: '',
// //   });

// //   // State for editing fields: email, password and about
// //   const [editMode, setEditMode] = useState(false);
// //   const [newEmail, setNewEmail] = useState('');
// //   const [newPassword, setNewPassword] = useState('');
// //   const [newAbout, setNewAbout] = useState('');

// //   // State for Add Balance UI
// //   const [addBalanceMode, setAddBalanceMode] = useState(false);
// //   const [balanceToAdd, setBalanceToAdd] = useState('');

// //   // State for orders list
// //   const [orders, setOrders] = useState([]);

// //   // Function to load user info from cookie
// //   const loadUserInfo = () => {
// //     const rawUserInfo = getCookie('userInfo');
// //     if (rawUserInfo) {
// //       try {
// //         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
// //         setUser({
// //           username: parsed.username || 'Unknown',
// //           email: parsed.usermail || 'No Email',
// //           role: 'Student',
// //           balance: parsed.balance || 0,
// //           about: parsed.about || 'This is your about section. Click edit to modify.',
// //         });
// //       } catch (error) {
// //         console.error('Error parsing userInfo cookie:', error);
// //       }
// //     }
// //   };

// //   // Function to load orders for the logged-in user
// //   const loadOrders = () => {
// //     const rawUserInfo = getCookie('userInfo');
// //     if (rawUserInfo) {
// //       try {
// //         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
// //         fetch(`http://localhost:3000/orders/get?user_id=${parsed.userId}`, {
// //           credentials: 'include',
// //         })
// //           .then((res) => res.json())
// //           .then((data) => {
// //             if (data.orders) {
// //               setOrders(data.orders);
// //             } else {
// //               setOrders([]);
// //             }
// //           })
// //           .catch((error) => {
// //             console.error("Error fetching orders:", error);
// //             setOrders([]);
// //           });
// //       } catch (error) {
// //         console.error('Error parsing userInfo cookie for orders:', error);
// //       }
// //     }
// //   };

// //   // Load user info and orders on mount
// //   useEffect(() => {
// //     loadUserInfo();
// //     loadOrders();
// //   }, []);

// //   // Handler for enabling edit mode
// //   const handleEditClick = () => {
// //     setEditMode(true);
// //     setNewEmail(user.email);
// //     setNewPassword('');
// //     setNewAbout(user.about);
// //   };

// //   // Handler for cancelling edit
// //   const handleCancelEdit = () => {
// //     setEditMode(false);
// //     setNewEmail('');
// //     setNewPassword('');
// //     setNewAbout('');
// //   };

// //   // Handler for submitting updated email, password and about info
// //   const handleSave = async () => {
// //     if (!newEmail || !newPassword) {
// //       toast.error('Please provide both a new email and password.');
// //       return;
// //     }
// //     try {
// //       const response = await fetch('http://localhost:3000/users/update', {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({
// //           email: newEmail,
// //           password: newPassword,
// //           about: newAbout,
// //         }),
// //       });

// //       const data = await response.json();
// //       if (!response.ok) {
// //         toast.error(data.error || 'Error updating user info');
// //       } else {
// //         toast.success('User info updated successfully');
// //         setUser((prev) => ({
// //           ...prev,
// //           email: newEmail,
// //           about: newAbout,
// //         }));
// //         setEditMode(false);

// //         document.cookie = `userInfo=${encodeURIComponent(
// //           JSON.stringify({
// //             ...data.user,
// //             username: user.username,
// //             balance: user.balance,
// //           })
// //         )}; path=/;`;
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //       toast.error('An error occurred while updating user info.');
// //     }
// //   };

// //   // Handler to toggle the Add Balance UI
// //   const handleToggleAddBalance = () => {
// //     setAddBalanceMode((prev) => !prev);
// //     setBalanceToAdd('');
// //   };

// //   // Handler for submitting the additional balance amount
// //   const handleAddBalance = async () => {
// //     if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
// //       toast.error('Please enter a valid amount.');
// //       return;
// //     }
// //     try {
// //       const response = await fetch('http://localhost:3000/users/add_balance', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({
// //           amount: Number(balanceToAdd),
// //         }),
// //       });
// //       const data = await response.json();
// //       if (!response.ok) {
// //         toast.error(data.error || 'Error updating balance');
// //       } else {
// //         toast.success('Balance added successfully');
// //         setUser((prev) => ({
// //           ...prev,
// //           balance: data.balance,
// //         }));
// //         setAddBalanceMode(false);
// //         document.cookie = `userInfo=${encodeURIComponent(
// //           JSON.stringify({
// //             ...data.user,
// //             username: user.username,
// //             balance: data.balance,
// //           })
// //         )}; path=/;`;
// //       }
// //     } catch (error) {
// //       console.error('Error updating balance:', error);
// //       toast.error('An error occurred while updating balance.');
// //     }
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto my-10 p-6">
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         {/* Left Panel */}
// //         <div className="bg-blue-600 rounded-lg text-white p-6">
// //           <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
// //             {user.username ? user.username[0].toUpperCase() : '??'}
// //           </div>
// //           <h2 className="text-2xl font-semibold">{user.username}</h2>
// //           <p className="text-md mb-1">{user.role}</p>
// //           <p className="text-md mb-4">{user.email}</p>
// //           <div className="border-t border-blue-300 pt-4">
// //             <h3 className="font-semibold text-lg">Current Balance</h3>
// //             <p className="text-xl">${user.balance}</p>
// //             {/* Add Balance Button */}
// //             <button
// //               onClick={handleToggleAddBalance}
// //               className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
// //             >
// //               {addBalanceMode ? "Cancel" : "Add Balance"}
// //             </button>
// //             {/* Add Balance Input UI */}
// //             {addBalanceMode && (
// //               <div className="mt-2">
// //                 <input
// //                   type="number"
// //                   placeholder="Enter amount"
// //                   value={balanceToAdd}
// //                   onChange={(e) => setBalanceToAdd(e.target.value)}
// //                   className="p-2 rounded border border-gray-300"
// //                 />
// //                 <button
// //                   onClick={handleAddBalance}
// //                   className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
// //                 >
// //                   Submit
// //                 </button>
// //               </div>
// //             )}
// //             {/* Refresh Profile Button */}
// //             <button
// //               onClick={loadUserInfo}
// //               className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
// //             >
// //               Refresh Profile
// //             </button>
// //           </div>
// //         </div>

// //         {/* Right Panel */}
// //         <div className="col-span-2 bg-white rounded-lg shadow p-6">
// //           <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
// //             <h3 className="text-2xl font-semibold">Profile</h3>
// //             {!editMode && (
// //               <button
// //                 onClick={handleEditClick}
// //                 className="text-lg bg-blue-600 text-white px-4 py-2 rounded"
// //               >
// //                 Edit
// //               </button>
// //             )}
// //           </div>
// //           <div className="mt-6 space-y-6">
// //             <div>
// //               <h4 className="text-xl font-medium">About</h4>
// //               {editMode ? (
// //                 <textarea
// //                   value={newAbout}
// //                   onChange={(e) => setNewAbout(e.target.value)}
// //                   className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   rows="4"
// //                 />
// //               ) : (
// //                 <p className="text-lg text-gray-600 mt-2">{user.about}</p>
// //               )}
// //             </div>
// //             <div>
// //               <h4 className="text-xl font-medium">Orders</h4>
// //               {orders.length === 0 ? (
// //                 <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
// //               ) : (
// //                 <div className="mt-2 space-y-4">
// //                   {orders.map((order) => (
// //                     <div key={order.id} className="p-4 border rounded">
// //                       <h5 className="text-lg font-bold">Order #{order.order_id}</h5>
// //                       <p>Total: ${order.total_price}</p>
// //                       {order.delivery_address && <p>Delivery Address: {order.delivery_address}</p>}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //               {/* Refresh Orders Button */}
// //               <button
// //                 onClick={loadOrders}
// //                 className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
// //               >
// //                 Refresh Orders
// //               </button>
// //             </div>
// //             {editMode && (
// //               <div className="bg-gray-50 p-6 rounded-md">
// //                 <div className="mb-4">
// //                   <label className="block text-lg font-medium text-gray-700">
// //                     New Email
// //                   </label>
// //                   <input
// //                     type="email"
// //                     value={newEmail}
// //                     onChange={(e) => setNewEmail(e.target.value)}
// //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-lg font-medium text-gray-700">
// //                     New Password
// //                   </label>
// //                   <input
// //                     type="password"
// //                     value={newPassword}
// //                     onChange={(e) => setNewPassword(e.target.value)}
// //                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
// //                   />
// //                 </div>
// //                 <div className="flex space-x-4 mt-6">
// //                   <button
// //                     onClick={handleSave}
// //                     className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={handleCancelEdit}
// //                     className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Profile;
// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// // Helper to get a cookie by name
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }

// function Profile() {
//   const navigate = useNavigate();

//   // State for user info
//   const [user, setUser] = useState({
//     username: '',
//     email: '',
//     role: 'Student',
//     balance: 0,
//     about: '',
//   });

//   // State for editing fields
//   const [editMode, setEditMode] = useState(false);
//   const [newEmail, setNewEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [newAbout, setNewAbout] = useState('');

//   // State for Add Balance UI
//   const [addBalanceMode, setAddBalanceMode] = useState(false);
//   const [balanceToAdd, setBalanceToAdd] = useState('');

//   // State for orders list
//   const [orders, setOrders] = useState([]);

//   // Load user info from cookie
//   const loadUserInfo = () => {
//     const rawUserInfo = getCookie('userInfo');
//     if (rawUserInfo) {
//       try {
//         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
//         setUser({
//           username: parsed.username || 'Unknown',
//           email: parsed.usermail || 'No Email',
//           role: 'Student',
//           balance: parsed.balance || 0,
//           about: parsed.about || 'This is your about section. Click edit to modify.',
//         });
//       } catch (error) {
//         console.error('Error parsing userInfo cookie:', error);
//       }
//     }
//   };

//   // Load orders for the logged-in user
//   const loadOrders = () => {
//     const rawUserInfo = getCookie('userInfo');
//     if (rawUserInfo) {
//       try {
//         const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
//         fetch(`http://localhost:3000/orders/get?user_id=${parsed.userId}`, {
//           credentials: 'include',
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.orders) {
//               setOrders(data.orders);
//             } else {
//               setOrders([]);
//             }
//           })
//           .catch((error) => {
//             console.error("Error fetching orders:", error);
//             setOrders([]);
//           });
//       } catch (error) {
//         console.error('Error parsing userInfo cookie for orders:', error);
//       }
//     }
//   };

//   // Load user info and orders on mount
//   useEffect(() => {
//     loadUserInfo();
//     loadOrders();
//   }, []);

//   // Handlers for edit mode
//   const handleEditClick = () => {
//     setEditMode(true);
//     setNewEmail(user.email);
//     setNewPassword('');
//     setNewAbout(user.about);
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     setNewEmail('');
//     setNewPassword('');
//     setNewAbout('');
//   };

//   const handleSave = async () => {
//     if (!newEmail || !newPassword) {
//       toast.error('Please provide both a new email and password.');
//       return;
//     }
//     try {
//       const response = await fetch('http://localhost:3000/users/update', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           email: newEmail,
//           password: newPassword,
//           about: newAbout,
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         toast.error(data.error || 'Error updating user info');
//       } else {
//         toast.success('User info updated successfully');
//         setUser((prev) => ({
//           ...prev,
//           email: newEmail,
//           about: newAbout,
//         }));
//         setEditMode(false);
//         document.cookie = `userInfo=${encodeURIComponent(
//           JSON.stringify({ ...user, balance: user.balance, email: newEmail, about: newAbout })
//         )}; path=/;`;
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred while updating user info.');
//     }
//   };

//   // Handlers for Add Balance
//   const handleToggleAddBalance = () => {
//     setAddBalanceMode((prev) => !prev);
//     setBalanceToAdd('');
//   };

//   const handleAddBalance = async () => {
//     if (!balanceToAdd || isNaN(balanceToAdd) || Number(balanceToAdd) <= 0) {
//       toast.error('Please enter a valid amount.');
//       return;
//     }
//     try {
//       const response = await fetch('http://localhost:3000/users/add_balance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           amount: Number(balanceToAdd),
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         toast.error(data.error || 'Error updating balance');
//       } else {
//         toast.success('Balance added successfully');
//         setUser((prev) => ({
//           ...prev,
//           balance: data.balance,
//         }));
//         setAddBalanceMode(false);
//         document.cookie = `userInfo=${encodeURIComponent(
//           JSON.stringify({ ...user, balance: data.balance })
//         )}; path=/;`;
//       }
//     } catch (error) {
//       console.error('Error updating balance:', error);
//       toast.error('An error occurred while updating balance.');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto my-10 p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left Panel */}
//         <div className="bg-blue-600 rounded-lg text-white p-6">
//           <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-3xl font-bold mb-6">
//             {user.username ? user.username[0].toUpperCase() : '??'}
//           </div>
//           <h2 className="text-2xl font-semibold">{user.username}</h2>
//           <p className="text-md mb-1">{user.role}</p>
//           <p className="text-md mb-4">{user.email}</p>
//           <div className="border-t border-blue-300 pt-4">
//             <h3 className="font-semibold text-lg">Current Balance</h3>
//             <p className="text-xl">${user.balance}</p>
//             <button onClick={handleToggleAddBalance} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
//               {addBalanceMode ? "Cancel" : "Add Balance"}
//             </button>
//             {addBalanceMode && (
//               <div className="mt-2">
//                 <input
//                   type="number"
//                   placeholder="Enter amount"
//                   value={balanceToAdd}
//                   onChange={(e) => setBalanceToAdd(e.target.value)}
//                   className="p-2 rounded border border-gray-300"
//                 />
//                 <button onClick={handleAddBalance} className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
//                   Submit
//                 </button>
//               </div>
//             )}
//             <button onClick={loadUserInfo} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//               Refresh Profile
//             </button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="col-span-2 bg-white rounded-lg shadow p-6">
//           <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
//             <h3 className="text-2xl font-semibold">Profile</h3>
//             {!editMode && (
//               <button onClick={handleEditClick} className="text-lg bg-blue-600 text-white px-4 py-2 rounded">
//                 Edit
//               </button>
//             )}
//           </div>
//           <div className="mt-6 space-y-6">
//             <div>
//               <h4 className="text-xl font-medium">About</h4>
//               {editMode ? (
//                 <textarea
//                   value={newAbout}
//                   onChange={(e) => setNewAbout(e.target.value)}
//                   className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
//                   rows="4"
//                 />
//               ) : (
//                 <p className="text-lg text-gray-600 mt-2">{user.about}</p>
//               )}
//             </div>
//             <div>
//               <h4 className="text-xl font-medium">Orders</h4>
//               {orders.length === 0 ? (
//                 <p className="text-lg text-gray-600 mt-2">No orders yet.</p>
//               ) : (
//                 <div className="mt-2 space-y-4">
//                   {orders.map((order) => (
//                     <div key={order.id} className="p-4 border rounded">
//                       <h5 className="text-lg font-bold">Order #{order.order_id}</h5>
//                       <p>Total: ${order.total_price}</p>
//                       {order.delivery_address && <p>Delivery Address: {order.delivery_address}</p>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <button onClick={loadOrders} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//                 Refresh Orders
//               </button>
//             </div>
//             {editMode && (
//               <div className="bg-gray-50 p-6 rounded-md">
//                 <div className="mb-4">
//                   <label className="block text-lg font-medium text-gray-700">New Email</label>
//                   <input
//                     type="email"
//                     value={newEmail}
//                     onChange={(e) => setNewEmail(e.target.value)}
//                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-lg font-medium text-gray-700">New Password</label>
//                   <input
//                     type="password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="mt-2 block w-full p-4 border border-gray-300 rounded text-lg"
//                   />
//                 </div>
//                 <div className="flex space-x-4 mt-6">
//                   <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded text-lg">
//                     Save
//                   </button>
//                   <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-6 py-3 rounded text-lg">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;


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

  // State for user info
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 'Student',
    balance: 0,
    about: '',
  });

  // State for editing fields
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAbout, setNewAbout] = useState('');

  // State for Add Balance UI
  const [addBalanceMode, setAddBalanceMode] = useState(false);
  const [balanceToAdd, setBalanceToAdd] = useState('');

  // State for orders list
  const [orders, setOrders] = useState([]);

  // Function to load user info from cookie
  const loadUserInfo = () => {
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
  };

  // Function to load orders for the logged-in user using user_id as a query parameter
  const loadOrders = () => {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        // Using "user_id" query parameter as specified
        fetch(`http://localhost:3000/orders/get?user_id=${parsed.userId}`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.orders) {
              setOrders(data.orders);
            } else {
              setOrders([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
            setOrders([]);
          });
      } catch (error) {
        console.error('Error parsing userInfo cookie for orders:', error);
      }
    }
  };

  // Load user info and orders on mount
  useEffect(() => {
    loadUserInfo();
    loadOrders();
  }, []);

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
          JSON.stringify({ ...user, balance: user.balance, email: newEmail, about: newAbout })
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
        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify({ ...user, balance: data.balance })
        )}; path=/;`;
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
            <p className="text-xl">${user.balance}</p>
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
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded">
                      <h5 className="text-lg font-bold">Order #{order.order_id}</h5>
                      <p>Total: ${order.total_price}</p>
                      {order.delivery_address && <p>Delivery Address: {order.delivery_address}</p>}
                    </div>
                  ))}
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

