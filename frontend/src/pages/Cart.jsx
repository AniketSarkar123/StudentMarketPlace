import React from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function Cart() {
  const { cart, removeItemFromCart, updateQuantity, clearCart } = useCart();

  // Handler to increment quantity
  const handleIncrement = (item) => {
    updateQuantity(item.name, item.sellerId, item.quantity + 1);
  };

  // Handler to decrement quantity (and remove if quantity becomes 0)
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.name, item.sellerId, item.quantity - 1);
    } else {
      // Optionally, remove item if quantity reaches 0
      removeItemFromCart({ name: item.name, sellerId: item.sellerId });
      toast.info("Item removed from cart");
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
          <li
            key={index}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">{item.name}</h2>
              <p>Seller ID: {item.sellerId}</p>
              <p>Price: ${item.price}</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleDecrement(item)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-l"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() =>
                removeItemFromCart({ name: item.name, sellerId: item.sellerId })
              }
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={clearCart}
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
      >
        Clear Cart
      </button>
    </div>
  );
}

export default Cart;
