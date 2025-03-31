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

    if (user.balance < totalPrice) {
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

      // Deduct the order total using the update_bal endpoint.
      const balanceResponse = await fetch("http://localhost:3000/users/add_balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({  userId: user.userId,
          amount: -totalPrice })
      });
      const balanceResult = await balanceResponse.json();
      if (!balanceResponse.ok) {
        toast.error(balanceResult.error || "Error updating balance");
        return;
      }

      toast.success("Order placed successfully!");
      navigate("/comments")
      // clearCart();
      setOrderMode(false);
      setDeliveryAddress("");

      // Update the cookie with the new balance by merging with the existing user info.
     
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
              <p>Price: ${item.price}</p>
              <div className="flex items-center mt-2">
                <button onClick={() => handleDecrement(item)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-l">
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button onClick={() => handleIncrement(item)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-r">
                  +
                </button>
              </div>
            </div>
            <button onClick={() => removeItemFromCart({ name: item.name, sellerId: item.sellerId })} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <p className="text-xl font-semibold">Total: ${totalPrice}</p>
      </div>
      <button onClick={() => setOrderMode((prev) => !prev)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        {orderMode ? "Cancel Order" : "Order Items"}
      </button>
      {orderMode && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Enter Delivery Details</h2>
          <input
            type="text"
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
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
