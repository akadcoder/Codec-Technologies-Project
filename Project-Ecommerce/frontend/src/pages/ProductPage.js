import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    try {
      await api.post(`/products/${id}/reviews`, review);
      alert('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
      fetchProduct(); // Refresh product data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="product-details">
        {/* Product Images */}
        <div className="product-gallery">
          <img 
            src={product.images[selectedImage]} 
            alt={product.name}
            className="main-image"
          />
          <div className="thumbnail-gallery">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="product-meta">
            <span>Brand: {product.brand}</span>
            <span>Category: {product.category}</span>
            <span>Stock: {product.countInStock}</span>
          </div>

          <div className="star-rating">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(product.rating) ? '' : 'empty'}`}
              >
                ⭐
              </span>
            ))}
            <span style={{ marginLeft: '0.5rem' }}>
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="price">
            ${product.discountPrice || product.price}
            {product.discountPrice && (
              <span className="original-price">${product.price}</span>
            )}
          </div>

          <p style={{ marginBottom: '2rem' }}>{product.description}</p>

          {product.countInStock > 0 ? (
            <div className="add-to-cart-section">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '1rem' }}>Quantity:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ddd' }}
                >
                  {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '1.1rem' }}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="alert alert-error">
              This product is currently out of stock
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '3rem' }}>
        <h3>Customer Reviews</h3>
        
        {product.reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div>
            {product.reviews.map(review => (
              <div key={review._id} className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{review.name}</strong>
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < review.rating ? '' : 'empty'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <small style={{ color: '#6b7280' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        {isAuthenticated && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-content">
              <h4>Write a Review</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="form-input"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="form-input form-textarea"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
