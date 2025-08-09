const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/:productId', auth, updateCartItem);
router.delete('/:productId', auth, removeFromCart);
router.delete('/', auth, clearCart);

module.exports = router;
