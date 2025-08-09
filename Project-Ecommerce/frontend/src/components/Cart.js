import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, totalAmount, updateCartItem, removeFromCart, loading } = useCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.product._id} className="cart-item">
            <img 
              src={item.product.images[0]} 
              alt={item.product.name}
              className="cart-item-image"
            />
            
            <div className="cart-item-details">
              <h4>{item.product.name}</h4>
              <p>${item.price}</p>
            </div>
            
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
              >
                -
              </button>
              <input 
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                className="quantity-input"
                min="1"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div style={{ fontWeight: 'bold' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              onClick={() => handleRemoveItem(item.product._id)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Cart;
