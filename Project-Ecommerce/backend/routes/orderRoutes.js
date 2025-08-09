const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getUserOrders,
  createPaymentIntent
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/myorders', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/pay', auth, updateOrderToPaid);
router.post('/create-payment-intent', auth, createPaymentIntent);

module.exports = router;
