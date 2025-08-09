import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, totalAmount } = useCart();

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="grid grid-2">
        <div>
          <Cart />
        </div>
        
        {items.length > 0 && (
          <div>
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping:</span>
                <span>$5.99</span>
              </div>
              
              <div className="summary-line">
                <span>Tax:</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-line summary-total">
                <span>Total:</span>
                <span>${(totalAmount + 5.99 + (totalAmount * 0.1)).toFixed(2)}</span>
              </div>
              
              <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
