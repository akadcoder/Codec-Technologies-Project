import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    images: ['']
  });

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = value;
    setNewProduct(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const addImageField = () => {
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (newProduct.images.length > 1) {
      const updatedImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct(prev => ({
        ...prev,
        images: updatedImages
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        countInStock: Number(newProduct.countInStock),
        images: newProduct.images.filter(img => img.trim() !== '')
      };

      await api.post('/admin/products', productData);
      alert('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        images: ['']
      });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      alert('Error creating product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  if (!stats) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <h3>Recent Orders</h3>
          {stats.recentOrders.length === 0 ? (
            <p>No recent orders</p>
          ) : (
            stats.recentOrders.map(order => (
              <div key={order._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem', 
                borderBottom: '1px solid #e5e7eb',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 'bold' }}>#{order._id.slice(-8)}</span>
                <span>{order.user.name}</span>
                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  background: order.status === 'delivered' ? '#d1fae5' : '#fef3c7',
                  color: order.status === 'delivered' ? '#065f46' : '#92400e',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Product Management */}
      <div className="card">
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Product Management</h3>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} style={{ 
              marginBottom: '2rem', 
              padding: '2rem', 
              background: '#f8f9fa', 
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Add New Product</h4>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="e.g. Electronics, Fashion"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Brand name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Count</label>
                  <input
                    type="number"
                    name="countInStock"
                    value={newProduct.countInStock}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    required
                    placeholder="Available quantity"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  required
                  placeholder="Detailed product description"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Images (URLs)</label>
                {newProduct.images.map((image, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      style={{ flex: 1 }}
                    />
                    {newProduct.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="btn btn-outline"
                  style={{ marginTop: '0.5rem' }}
                >
                  + Add Another Image
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  Create Product
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Products List */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>
              All Products ({products.length})
            </h4>
            
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <p>No products found. Add your first product!</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {products.map(product => (
                  <div key={product._id} className="card">
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={product.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-content">
                      <h5 style={{ marginBottom: '0.5rem' }}>{product.name}</h5>
                      <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        ${product.price}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Stock: {product.countInStock}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Category: {product.category}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="btn btn-secondary"
                          style={{ flex: 1, fontSize: '0.9rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
