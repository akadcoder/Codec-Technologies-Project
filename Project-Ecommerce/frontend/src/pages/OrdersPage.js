import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Order #{order._id.slice(-8)}</h4>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    background: order.status === 'delivered' ? '#d1fae5' : '#fef3c7',
                    color: order.status === 'delivered' ? '#065f46' : '#92400e'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                  <p><strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h5>Items:</h5>
                  {order.orderItems.map(item => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }}
                      />
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to={`/order/${order._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                  {!order.isPaid && (
                    <button className="btn btn-primary">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
