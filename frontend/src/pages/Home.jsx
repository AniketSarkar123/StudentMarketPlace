import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

// Helper to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// SellerRating component: Fetches and displays seller's rating as stars
function SellerRating({ sellerId }) {
  const [rating, setRating] = useState(null);

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
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setRating(0);
      }
    }
    fetchRating();
  }, [sellerId]);

  if (rating === null) return <span>Loading rating...</span>;

  // Round rating to nearest integer for star display
  const roundedRating = Math.round(rating);
  return (
    <div>
      <span>
        {Array.from({ length: 5 }, (_, i) =>
          i < roundedRating ? "★" : "☆"
        )}
      </span>
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}

function Home() {
  const [items, setItems] = useState([]); // full list of items
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    grade: "",
    subject: "",
    maxPrice: 1000, // Price slider filter
  });
  const [selectedItem, setSelectedItem] = useState(null); // detail view for one item
  const [reviewsVisibility, setReviewsVisibility] = useState({});
  const [ownerId, setOwnerId] = useState(null);
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  // On mount: parse cookie to get user info
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

  // Fetch all items once on mount
  useEffect(() => {
    fetch("http://localhost:3000/items/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((error) => {
        console.error("Error fetching items", error);
        toast.error("Error fetching items");
      });
  }, []);

  // Compute filtered items inline from items, searchQuery, and filters.
  const getFilteredItems = () => {
    return items.filter((item) => {
      // Use default empty string for each property if undefined.
      if (searchQuery.trim() !== "" && !((item.name || "").toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      if (filters.category.trim() !== "" && !((item.category || "").toLowerCase().includes(filters.category.toLowerCase()))) {
        return false;
      }
      if (filters.condition.trim() !== "" && !((item.condition || "").toLowerCase().includes(filters.condition.toLowerCase()))) {
        return false;
      }
      if (filters.grade.trim() !== "" && !((item.grade || "").toLowerCase().includes(filters.grade.toLowerCase()))) {
        return false;
      }
      if (filters.subject.trim() !== "" && !((item.subject || "").toLowerCase().includes(filters.subject.toLowerCase()))) {
        return false;
      }
      // Price filtering: only include items with price <= maxPrice
      if (Number(item.price) > Number(filters.maxPrice)) {
        return false;
      }
      return true;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceSliderChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }));
  };

  // Handler when a suggestion is clicked to render detail view
  const handleSuggestionClick = (itemId) => {
    fetch(`http://localhost:3000/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.item) {
          setSelectedItem(data.item);
          setSearchQuery(""); // clear search field
        } else {
          toast.error("Item not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching item detail:", error);
        toast.error("Error fetching item details");
      });
  };

  // Option to clear the detail view and return to the full grid
  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Toggle reviews for an item in grid view
  const toggleReviews = (id) => {
    setReviewsVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderSearchBar = () => (
    <div style={{ padding: "10px", maxWidth: "600px", margin: "20px auto" }}>
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
          style={{
            flex: "1",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={filters.condition}
          onChange={handleFilterChange}
          style={{
            flex: "1",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={filters.grade}
          onChange={handleFilterChange}
          style={{
            flex: "1",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleFilterChange}
          style={{
            flex: "1",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Maximum Price: Rs. {filters.maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.maxPrice}
          onChange={handlePriceSliderChange}
          style={{ width: "100%" }}
        />
      </div>
      {(searchQuery || Object.values(filters).some(val => typeof val === "string" && val.trim() !== "")) && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {getFilteredItems().map((item) => (
            <li
              key={item.id}
              onClick={() => handleSuggestionClick(item.id)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              {item.name} - {item.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (selectedItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderSearchBar()}
        <button
          onClick={handleBackToList}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to List
        </button>
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "4px" }}>
          <h1 className="text-3xl font-bold">{selectedItem.name}</h1>
          {selectedItem.images && selectedItem.images.length > 0 && (
            <img
              src={selectedItem.images[0]}
              alt={selectedItem.name}
              style={{ width: "100%", height: "auto", marginTop: "20px" }}
            />
          )}
          <p className="mt-4"><strong>Category:</strong> {selectedItem.category}</p>
          <p className="mt-2"><strong>Condition:</strong> {selectedItem.condition}</p>
          <p className="mt-2"><strong>Grade:</strong> {selectedItem.grade}</p>
          <p className="mt-2"><strong>Subject:</strong> {selectedItem.subject}</p>
          <p className="mt-2"><strong>Price:</strong> ${selectedItem.price}</p>
          {ownerId && Number(ownerId) !== Number(selectedItem.owner_id) && (
            <button
              onClick={() => {
                addItemToCart({
                  name: selectedItem.name,
                  quantity: 1,
                  price: selectedItem.price,
                  sellerId: selectedItem.owner_id,
                });
                toast.success("Added to cart successfully!");
              }}
              style={{
                padding: "10px 20px",
                marginTop: "20px",
                border: "none",
                background: "#28a745",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          )}
          {selectedItem.reviews && selectedItem.reviews.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <ul className="list-disc list-inside">
                {selectedItem.reviews.map((review, i) => (
                  <li key={i} className="mt-1">{review}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4">No reviews yet.</p>
          )}
        </div>
      </div>
    );
  }

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
      {renderSearchBar()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredItems().map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
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
              <p className="text-gray-600">Price: Rs. {item.price}</p>
              <SellerRating sellerId={item.owner_id} />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => toggleReviews(item.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  {reviewsVisibility[item.id] ? 'Hide Reviews' : 'Show Reviews'}
                </button>
                {ownerId && Number(ownerId) === Number(item.owner_id) ? (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                    onClick={() => navigate('/edit')}
                  >
                    EDIT
                  </button>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    onClick={() => {
                      addItemToCart({
                        name: item.name,
                        quantity: 1,
                        price: item.price,
                        sellerId: item.owner_id,
                      });
                      toast.success("Added to cart successfully!");
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
