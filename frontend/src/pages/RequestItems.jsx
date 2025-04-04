import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function RequestItems() {
  const [items, setItems] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [requestedItems, setRequestedItems] = useState({});

  useEffect(() => {
    const rawUserInfo = getCookie("userInfo");
    if (rawUserInfo) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(rawUserInfo));
        setOwnerId(userInfo.userId);
      } catch (error) {
        console.error("Error parsing userInfo cookie:", error);
      }
    }
  }, []);

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

  const handleRequest = (item) => {
    const rawUserInfo = getCookie('userInfo');
    if (rawUserInfo) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawUserInfo));
        const isConfirmed = window.confirm(
          `Do you want to request "${item.name}" for donation from Seller?`
        );
        if (!isConfirmed) return;
        setRequestedItems((prev) => ({ ...prev, [item.id]: true }));
        const emailPayload = {
          sellerId: item.owner_id,
          subject: `Donation Request for ${item.name}`,
          text: `User ${parsed.username} (Email: ${parsed.usermail}) is requesting the donation of "${item.name}" priced at Rs. ${item.price}. Please contact them for further details.`,
        };
        fetch("http://localhost:3000/email/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success(`Request sent! Seller ${item.owner_id} will contact you soon.`);
              alert(`Your DONATION request for "${item.name}" has been sent to Seller. They will contact you shortly.`);
            } else {
              toast.error("Error sending request email.");
            }
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            toast.error("An error occurred while sending the request email.");
          });
      } catch (error) {
        console.error('Error parsing userInfo cookie:', error);
      }
    }
    // toast.success(`User ${ownerId} has requested ${item.name} from Seller ${item.owner_id}`);
    // alert(`User ${ownerId} has requested "${item.name}" from Seller ${item.owner_id}. Seller ${item.owner_id} will contact you shortly for details.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Request Items
        </h1>
        <p className="mt-3 text-gray-500 text-lg">
          Browse items and request them directly from sellers.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.filter(item => item.available !== false).map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden p-4">
            {item.images && item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{item.name}</h2>
            <p className="text-gray-600">Category: {item.category}</p>
            <p className="text-gray-600">Condition: {item.condition}</p>
            <p className="text-gray-600">Grade: {item.grade}</p>
            <p className="text-gray-600">Price: Rs. {item.price}</p>
            <button
              onClick={() => handleRequest(item)}
              disabled={requestedItems[item.id] || false}
              className={`mt-4 py-2 px-4 rounded w-full ${requestedItems[item.id] ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              {requestedItems[item.id] ? 'REQUESTED' : 'REQUEST'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RequestItems;
