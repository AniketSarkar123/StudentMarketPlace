import { useState } from 'react';
import toast from 'react-hot-toast';
import uploadImages from '../firebase/uploadImages'; // Adjust path as needed

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function EditItem() {
  const [formData, setFormData] = useState({
    name: '',         // Identifier for the product to edit
    category: '',
    condition: '',
    grade: '',
    subject: '',
    price: '',
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

  // Handle form submission for editing an item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images if any are selected.
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
        console.log('Uploaded image URLs:', imageUrls);
      }

      // Get the logged in user's info from cookie and parse it.
      const rawUserInfo = getCookie("userInfo");
      let ownerId;
      if (!rawUserInfo) {
        console.error("No user info cookie found!");
      } else {
        try {
          const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
          ownerId = userInfo.userId;
          console.log("Owner ID:", ownerId);
        } catch (error) {
          console.error("Error parsing user info cookie:", error);
        }
      }
      const owner_id = Number(ownerId);

      // Prepare the payload. Only include new images if uploaded.
      const payload = {
        name: formData.name,               // Identifier used to locate the item
        category: formData.category,
        condition: formData.condition,
        grade: formData.grade,
        subject: formData.subject,
        price: Number(formData.price),
        owner_id,                         // From cookie
      };
      if (imageUrls.length > 0) {
        payload.images = imageUrls;
      }

      // Send the payload to the backend API for editing.
      const response = await fetch('http://localhost:3000/items/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        toast.error(data.error || 'Error editing item');
      } else {
        toast.success('Item updated successfully!');
        // Optionally, reset form fields
        setFormData({
          name: '',
          category: '',
          condition: '',
          grade: '',
          subject: '',
          price: '',
        });
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while editing the item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field to identify which item to edit */}
        <div>
          <label className="block mb-1">Name (Identifier)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter product name to edit"
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter category"
          />
        </div>
        <div>
          <label className="block mb-1">Condition</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter condition"
          />
        </div>
        <div>
          <label className="block mb-1">Grade</label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter grade"
          />
        </div>
        <div>
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter subject"
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block mb-1">New Images (Optional)</label>
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
            className="cursor-pointer inline-block bg-blue-600 text-white py-2 px-4 rounded"
          >
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : 'Select New Images'}
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  );
}

export default EditItem;
