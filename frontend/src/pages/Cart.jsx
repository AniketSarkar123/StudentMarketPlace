import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// Helper to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Function to fetch the current user balance from backend
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

function Cart() {
  const { cart, removeItemFromCart, updateQuantity, clearCart } = useCart();
  const [orderMode, setOrderMode] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();

  // Calculate total price from cart items
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handler to increment quantity
  const handleIncrement = (item) => {
    updateQuantity(item.name, item.sellerId, item.quantity + 1);
  };

  // Handler to decrement quantity (removes item if quantity becomes 0)
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.name, item.sellerId, item.quantity - 1);
    } else {
      removeItemFromCart({ name: item.name, sellerId: item.sellerId });
      toast.info("Item removed from cart");
    }
  };

  // Handler for placing an order
  const handleOrder = async () => {
    if (!deliveryAddress) {
      toast.error("Please enter a delivery address.");
      return;
    }
  
    const rawUserInfo = getCookie("userInfo");
    if (!rawUserInfo) {
      toast.error("User not authenticated.");
      return;
    }
    const user = JSON.parse(decodeURIComponent(rawUserInfo));
  
    // Fetch the latest balance from the backend
    const currentBalance = await fetchBalance(user.userId);
    if (currentBalance < totalPrice) {
      toast.error("Insufficient balance to complete the order.");
      return;
    }
  
    try {
      const orderData = {
        delivery_address: deliveryAddress,
        items: cart.map((item) => ({
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.sellerId
        })),
        total_price: totalPrice,
        user_id: String(user.userId)
      };
  
      const orderResponse = await fetch("http://localhost:3000/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData)
      });
      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) {
        toast.error(orderResult.error || "Error placing order");
        return;
      }
  
      // Deduct the order total using the update balance endpoint.
      const balanceResponse = await fetch("http://localhost:3000/users/add_balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({  
          userId: user.userId,
          amount: -totalPrice 
        })
      });
      const balanceResult = await balanceResponse.json();
      if (!balanceResponse.ok) {
        toast.error(balanceResult.error || "Error updating balance");
        return;
      }

      // Increment the order total using the update balance endpoint.
      const sellerTotals = {};
      cart.forEach(item => {
        sellerTotals[item.sellerId] = (sellerTotals[item.sellerId] || 0) + (item.price * item.quantity);
      });

      // Update balance for each seller
      for (const sellerId in sellerTotals) {
        const sellerAmount = sellerTotals[sellerId];
        const balanceResponseSeller = await fetch("http://localhost:3000/users/inc_balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId: sellerId,
            amount: Number(sellerAmount) 
          })
        });
        const balanceResultSeller = await balanceResponseSeller.json();
        if (!balanceResponseSeller.ok) {
          toast.error(balanceResultSeller.error || `Error updating balance for seller ${sellerId}`);
          return;
        }
      }
  
      // Mark all items in the cart as unavailable using the new route
      const names = cart.map(item => item.name);
      const unavailableResponse = await fetch("http://localhost:3000/items/make_unavailable", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names })
      });
      const unavailableResult = await unavailableResponse.json();
      if (!unavailableResponse.ok) {
        toast.error(unavailableResult.error || "Error marking items as unavailable");
        return;
      }
  
      toast.success("Order placed successfully!");
      // Optionally clear the cart after the order and updates
      //clearCart();
      navigate("/comments");
      setOrderMode(false);
      setDeliveryAddress("");
      
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An error occurred while placing the order.");
    }
  };
  

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="space-y-4">
        {cart.map((item, index) => (
          <li key={index} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="font-bold">{item.name}</h2>
              <p>Seller ID: {item.sellerId}</p>
              <p>Price: Rs. {item.price}</p>
              <div className="flex items-center mt-2">
                <button onClick={() => handleDecrement(item)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-l">
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                {/* <button onClick={() => handleIncrement(item)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-r">
                  +
                </button> */}
              </div>
            </div>
            <button onClick={() => removeItemFromCart({ name: item.name, sellerId: item.sellerId })} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <p className="text-xl font-semibold">Total: Rs. {totalPrice}</p>
      </div>
      <button onClick={() => setOrderMode((prev) => !prev)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        {orderMode ? "Cancel Order" : "Order Items"}
      </button>
      {orderMode && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Enter Delivery Details</h2>
          <input
            type="text"
            placeholder="Paste link of Delivery Address here"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          {/* Button to open the /delivery page in a new tab */}
          <a href="/delivery" target="_blank" rel="noopener noreferrer" className="block mb-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center">
            Open Delivery Map
          </a>
          <button onClick={handleOrder} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            Submit Order
          </button>
        </div>
      )}
      <button onClick={clearCart} className="mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded">
        Clear Cart
      </button>
    </div>
  );
}

export default Cart;
