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
  const [items, setItems] = useState([]); // full list of items
  const [filteredItems, setFilteredItems] = useState([]); // suggestions based on search query and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    grade: "",
    subject: "",
  });
  const [selectedItem, setSelectedItem] = useState(null); // detail view for one item
  const [reviewsVisibility, setReviewsVisibility] = useState({});
  const [ownerId, setOwnerId] = useState(null);
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
          setFilteredItems(data.items);
        }
      })
      .catch((error) => {
        console.error("Error fetching items", error);
        toast.error("Error fetching items");
      });
  }, []);

  // Combined filtering function (name and extra filters)
  const filterItems = (query, filters) => {
    let updatedItems = items;
    if (query.trim() !== "") {
      updatedItems = updatedItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filters.category.trim() !== "") {
      updatedItems = updatedItems.filter((item) =>
        item.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.condition.trim() !== "") {
      updatedItems = updatedItems.filter((item) =>
        item.condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    if (filters.grade.trim() !== "") {
      updatedItems = updatedItems.filter((item) =>
        item.grade.toLowerCase().includes(filters.grade.toLowerCase())
      );
    }
    if (filters.subject.trim() !== "") {
      updatedItems = updatedItems.filter((item) =>
        item.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }
    setFilteredItems(updatedItems);
  };

  // Handlers for search and filter input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterItems(searchQuery, newFilters);
  };

  // Handler when a suggestion is clicked
  const handleSuggestionClick = (itemId) => {
    // Fetch item details using the GET route: /items/:id
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
    setFilteredItems(items);
  };

  // Toggle reviews for an item in grid view (only used when no item is selected)
  const toggleReviews = (index) => {
    setReviewsVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Render the search bar with additional filter fields
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
      {searchQuery || Object.values(filters).some((val) => val.trim() !== "") ? (
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
          {filteredItems.map((item) => (
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
      ) : null}
    </div>
  );

  // If an item is selected, render its details
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

  // Otherwise, render the home grid view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {renderSearchBar()}
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
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                    onClick={() => navigate('/edit')}
                  >
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
