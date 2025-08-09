const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/products', auth, admin, createProduct);
router.put('/products/:id', auth, admin, updateProduct);
router.delete('/products/:id', auth, admin, deleteProduct);
router.get('/orders', auth, admin, getAllOrders);
router.put('/orders/:id', auth, admin, updateOrderStatus);
router.get('/dashboard', auth, admin, getDashboardStats);

module.exports = router;
