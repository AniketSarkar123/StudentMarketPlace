// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import uploadImages from '../firebase/uploadImages'; // Adjust path as needed

// // Helper to retrieve a cookie by name
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }

// function AddItem() {
//   const [formData, setFormData] = useState({
//     name: '',         // New field for product name
//     category: '',
//     condition: '',
//     grade: '',
//     subject: '',
//     price: '',
//     available: true,
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Update form field values
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle file selection (multiple files)
//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Upload images to Firebase Storage and retrieve URLs.
//       const imageUrls = await uploadImages(selectedFiles);
//       console.log('Uploaded image URLs:', imageUrls);

//       // Get the logged in user's info from cookie and parse it.
//       const rawUserInfo = getCookie("userInfo");
//       let ownerId;

//       if (!rawUserInfo) {
//         console.error("No user info cookie found!");
//       } else {
//         try {
//           // Decode and parse the cookie value
//           const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
//           // Extract the owner id (assuming it's stored as userId)
//           ownerId = userInfo.userId;
//           console.log("Owner ID:", ownerId);
//         } catch (error) {
//           console.error("Error parsing user info cookie:", error);
//         }
//       }
//       const owner_id = Number(ownerId);
//       // Prepare the payload using proper data types.
//       const payload = {
//         name: formData.name,               // New product name field
//         category: formData.category,
//         condition: formData.condition,
//         grade: formData.grade,
//         subject: formData.subject,
//         price: Number(formData.price),
//         images: imageUrls,                 // Array of image URLs
//         owner_id,                         // Taken from the user cookie
//       };

//       // Send the payload to the backend API.
//       const response = await fetch('http://localhost:3000/items/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.log(data);
//         toast.error(data.error || 'Error adding item');
//       } else {
//         toast.success('Item added successfully!');
//         // Optionally, reset form fields
//         setFormData({
//           name: '',
//           category: '',
//           condition: '',
//           grade: '',
//           subject: '',
//           price: '',
//         });
//         setSelectedFiles([]);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred while adding the item');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter product name"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter category"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Condition</label>
//           <input
//             type="text"
//             name="condition"
//             value={formData.condition}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter condition"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Grade</label>
//           <input
//             type="text"
//             name="grade"
//             value={formData.grade}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter grade"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Subject</label>
//           <input
//             type="text"
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter subject"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Price</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter price"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Images</label>
//           <input
//             id="images"
//             type="file"
//             name="images"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//           />
//           <label
//             htmlFor="images"
//             className="cursor-pointer inline-block bg-blue-600 text-white py-2 px-4 rounded"
//           >
//             {selectedFiles.length > 0
//               ? `${selectedFiles.length} file(s) selected`
//               : 'Select Images'}
//           </label>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`bg-blue-600 text-white py-2 px-4 rounded ${
//             loading ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//         >
//           {loading ? 'Adding...' : 'Add Item'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddItem;
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import uploadImages from '../firebase/uploadImages'; // Adjust path as needed

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function AddItem() {
  const [formData, setFormData] = useState({
    name: '',         // New field for product name
    category: '',
    condition: '',
    grade: '',
    subject: '',
    price: '',
    available: true,  // Default value for available
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update form field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection (multiple files)
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Firebase Storage and retrieve URLs.
      const imageUrls = await uploadImages(selectedFiles);
      console.log('Uploaded image URLs:', imageUrls);

      // Get the logged in user's info from cookie and parse it.
      const rawUserInfo = getCookie("userInfo");
      let ownerId;

      if (!rawUserInfo) {
        console.error("No user info cookie found!");
      } else {
        try {
          // Decode and parse the cookie value
          const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
          // Extract the owner id (assuming it's stored as userId)
          ownerId = userInfo.userId;
          console.log("Owner ID:", ownerId);
        } catch (error) {
          console.error("Error parsing user info cookie:", error);
        }
      }
      const owner_id = Number(ownerId);
      // Prepare the payload using proper data types.
      const payload = {
        name: formData.name,               // New product name field
        category: formData.category,
        condition: formData.condition,
        grade: formData.grade,
        subject: formData.subject,
        price: Number(formData.price),
        images: imageUrls,                 // Array of image URLs
        owner_id,                         // Taken from the user cookie
        available: formData.available,    // By default available is true
      };

      // Send the payload to the backend API.
      const response = await fetch('http://localhost:3000/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        toast.error(data.error || 'Error adding item');
      } else {
        toast.success('Item added successfully!');
        // Optionally, reset form fields
        setFormData({
          name: '',
          category: '',
          condition: '',
          grade: '',
          subject: '',
          price: '',
          available: true,  // Reset available to true by default
        });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the item');
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="container mx-auto p-4">
  //     <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div>
  //         <label className="block mb-1">Name</label>
  //         <input
  //           type="text"
  //           name="name"
  //           value={formData.name}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter product name"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Category</label>
  //         <input
  //           type="text"
  //           name="category"
  //           value={formData.category}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter category"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Condition</label>
  //         <input
  //           type="text"
  //           name="condition"
  //           value={formData.condition}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter condition"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Grade</label>
  //         <input
  //           type="text"
  //           name="grade"
  //           value={formData.grade}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter grade"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Subject</label>
  //         <input
  //           type="text"
  //           name="subject"
  //           value={formData.subject}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter subject"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Price</label>
  //         <input
  //           type="number"
  //           name="price"
  //           value={formData.price}
  //           onChange={handleChange}
  //           className="w-full p-2 border rounded"
  //           placeholder="Enter price"
  //         />
  //       </div>
  //       <div>
  //         <label className="block mb-1">Images</label>
  //         <input
  //           id="images"
  //           type="file"
  //           name="images"
  //           multiple
  //           onChange={handleFileChange}
  //           className="hidden"
  //         />
  //         <label
  //           htmlFor="images"
  //           className="cursor-pointer inline-block bg-blue-600 text-white py-2 px-4 rounded"
  //         >
  //           {selectedFiles.length > 0
  //             ? `${selectedFiles.length} file(s) selected`
  //             : 'Select Images'}
  //         </label>
  //       </div>
  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className={`bg-blue-600 text-white py-2 px-4 rounded ${
  //           loading ? 'opacity-50 cursor-not-allowed' : ''
  //         }`}
  //       >
  //         {loading ? 'Adding...' : 'Add Item'}
  //       </button>
  //     </form>
  //   </div>
  // );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter condition"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter grade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <input
            id="images"
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="images"
            className="cursor-pointer inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file selected`
              : 'Select Images'}
          </label>
          {selectedFiles.length > 0 && (
            <div className="mt-4 flex gap-4 flex-wrap">
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="h-32 w-32 object-cover rounded border border-gray-300"
                />
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
