import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';

const CheckoutPage = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const shipping = 5.99;
  const tax = totalAmount * 0.1;
  const total = totalAmount + shipping + tax;

  const orderData = {
    orderItems: items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images[0]
    })),
    shippingAddress,
    itemsPrice: totalAmount,
    taxPrice: tax,
    shippingPrice: shipping,
    totalPrice: total
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleOrderSuccess = async (order) => {
    await clearCart();
    navigate(`/order/${order._id}`);
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Add some items to proceed with checkout</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>Checkout</h2>
      
      <div className="grid grid-2">
        {/* Shipping Form */}
        <div>
          <div className="card">
            <div className="card-content">
              <h3>Shipping Address</h3>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-content">
              <h3>Payment Information</h3>
              <CheckoutForm orderData={orderData} onSuccess={handleOrderSuccess} />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              {items.map(item => (
                <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-line summary-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
