const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  timeLimit: {
    type: Number,
    default: 30 // minutes
  },
  passingScore: {
    type: Number,
    default: 70 // percentage
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
