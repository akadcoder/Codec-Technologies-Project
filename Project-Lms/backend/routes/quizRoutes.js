const express = require('express');
const router = express.Router();
const { createQuiz, getQuizById, submitQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/', auth, createQuiz);
router.get('/:id', auth, getQuizById);
router.post('/submit', auth, submitQuiz);

module.exports = router;
