import React, { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  cart: [] // Array of { name, quantity, price, sellerId }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item (by name and sellerId) already exists.
      const existingIndex = state.cart.findIndex(
        (item) => item.name === action.payload.name && item.sellerId === action.payload.sellerId
      );
      if (existingIndex >= 0) {
        // If exists, update quantity.
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += action.payload.quantity;
        return { cart: updatedCart };
      }
      return { cart: [...state.cart, action.payload] };
    case 'REMOVE_ITEM':
      return {
        cart: state.cart.filter(
          (item) =>
            !(item.name === action.payload.name && item.sellerId === action.payload.sellerId)
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        cart: state.cart.map((item) =>
          item.name === action.payload.name && item.sellerId === action.payload.sellerId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { cart: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    // Initialize from localStorage if available.
    const persisted = localStorage.getItem('cart');
    return persisted ? JSON.parse(persisted) : initial;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItemToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const updateQuantity = (name, sellerId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { name, sellerId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart: state.cart, addItemToCart, removeItemFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
