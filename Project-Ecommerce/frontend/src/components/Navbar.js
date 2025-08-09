import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            ShopHub
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/cart" className="cart-icon">
                    🛒
                    {getCartItemsCount() > 0 && (
                      <span className="cart-count">{getCartItemsCount()}</span>
                    )}
                  </Link>
                </li>
                <li><Link to="/orders">My Orders</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
                <li><span>Hi, {user?.name}</span></li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="btn btn-primary">Login</Link></li>
                <li><Link to="/register" className="btn btn-outline">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
