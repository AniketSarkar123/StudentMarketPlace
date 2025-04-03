import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

function Comments() {
  const { cart, clearCart } = useCart(); // Use cart and clearCart from context
  const [comments, setComments] = useState({});

  // Handler for input changes
  const handleChange = (itemName, value) => {
    setComments((prev) => ({
      ...prev,
      [itemName]: value,
    }));
  };

  // Handler for submitting comments
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload: only include items with non-empty comment values
    const payload = {
      comments: cart
        .filter((item) => {
          const comment = comments[item.name];
          return comment && comment.trim() !== "";
        })
        .map((item) => ({
          name: item.name,
          comment: comments[item.name].trim(),
        })),
    };

    console.log("Payload:", payload);

    if (payload.comments.length === 0) {
      toast.error("Please enter at least one comment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/items/add_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Error adding comments");
      } else {
        toast.success("Comments added successfully!");
        // Clear the cart only after successful submission of comments
        clearCart();
      }
    } catch (error) {
      console.error("Error submitting comments:", error);
      toast.error("An error occurred while submitting comments");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add Comments for Your Cart Items</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {cart.map((item) => (
            <div key={item.name} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p>
                Price: ${item.price} | Quantity: {item.quantity} | Seller ID: {item.sellerId}
              </p>
              <input
                type="text"
                placeholder="Enter your comment for this item..."
                value={comments[item.name] || ""}
                onChange={(e) => handleChange(item.name, e.target.value)}
                className="w-full p-2 mt-2 border rounded"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Submit Comments
          </button>
        </form>
      )}
    </div>
  );
}

export default Comments;
