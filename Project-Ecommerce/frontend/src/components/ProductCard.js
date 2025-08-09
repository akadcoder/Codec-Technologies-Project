import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    const result = await addToCart(product._id, 1);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="card product-card">
      {discountPercentage > 0 && (
        <div className="discount-badge">
          {discountPercentage}% OFF
        </div>
      )}
      
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.images[0] || 'https://via.placeholder.com/300x250?text=No+Image'} 
          alt={product.name}
          className="product-image"
        />
      </Link>
      
      <div className="card-content">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        
        <div className="star-rating">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`star ${i < Math.floor(product.rating) ? '' : 'empty'}`}
            >
              ⭐
            </span>
          ))}
          <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
            ({product.numReviews})
          </span>
        </div>
        
        <div className="price">
          ${product.discountPrice || product.price}
          {product.discountPrice && (
            <span className="original-price">${product.price}</span>
          )}
        </div>
        
        <p className="card-text">{product.description.substring(0, 100)}...</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/product/${product._id}`} className="btn btn-outline">
            View Details
          </Link>
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={product.countInStock === 0}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
