import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function Home() {
  const [items, setItems] = useState([]);
  const [reviewsVisibility, setReviewsVisibility] = useState({});
  const [ownerId, setOwnerId] = useState(null);
  const navigate = useNavigate();

  // Parse the cookie to get the logged in user's owner id on component mount.
  useEffect(() => {
    const rawUserInfo = getCookie("userInfo");
    if (rawUserInfo) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
        setOwnerId(userInfo.userId); // Assumes cookie stores userId as owner id
      } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
      }
    }
  }, []);

  // Fetch all items from the backend.
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/items/all');
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error("Error fetching items", error);
        toast.error("Error fetching items");
      }
    };
    fetchItems();
  }, []);

  const toggleReviews = (index) => {
    setReviewsVisibility(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to StudentMarket
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          The ultimate marketplace for students to buy, sell, and exchange academic materials, textbooks, and supplies.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
              {item.subject && (
                <p className="text-sm text-gray-500 mb-2">Subject: {item.subject}</p>
              )}
              <p className="text-gray-600">Category: {item.category}</p>
              <p className="text-gray-600">Condition: {item.condition}</p>
              <p className="text-gray-600">Grade: {item.grade}</p>
              <p className="text-gray-600">Price: ${item.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => toggleReviews(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {reviewsVisibility[index] ? 'Hide Reviews' : 'Show Reviews'}
                </button>
                {ownerId && Number(ownerId) === Number(item.owner_id) ? (
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded" onClick={() => navigate('/edit')}>
                    EDIT
                  </button>
                ) : (
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                    Add to Cart
                  </button>
                )}
              </div>
              {reviewsVisibility[index] && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
                  {item.reviews && item.reviews.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {item.reviews.map((review, i) => (
                        <li key={i} className="text-gray-600">{review}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
