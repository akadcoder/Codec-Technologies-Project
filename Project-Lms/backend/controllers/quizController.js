const Quiz = require('../models/Quiz');
const Certificate = require('../models/Certificate');

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId).populate('course');
    
    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    let certificate = null;
    if (passed) {
      const certificateNumber = `CERT-${Date.now()}-${req.user._id}`;
      certificate = await Certificate.create({
        user: req.user._id,
        course: quiz.course._id,
        quiz: quizId,
        score,
        percentage,
        certificateNumber
      });
    }

    res.json({
      score,
      totalPoints,
      percentage,
      passed,
      passingScore: quiz.passingScore,
      certificate: certificate?._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
