import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      setFeaturedProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured products:', error);
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
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to ShopHub</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h2>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-4">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>No featured products available.</p>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section style={{ background: 'white', padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Shop by Category</h2>
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3>Electronics</h3>
              <p>Latest gadgets and devices</p>
              <Link to="/products?category=Electronics" className="btn btn-outline">
                Browse Electronics
              </Link>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3>Fashion</h3>
              <p>Trendy clothing and accessories</p>
              <Link to="/products?category=Fashion" className="btn btn-outline">
                Browse Fashion
              </Link>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3>Home & Garden</h3>
              <p>Everything for your home</p>
              <Link to="/products?category=Home" className="btn btn-outline">
                Browse Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
