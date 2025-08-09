import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const QuizComponent = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/quizzes/submit', {
        quizId,
        answers
      });
      onComplete(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>{quiz.title}</h2>
        <div style={{ color: timeLeft < 300 ? '#ef4444' : '#4f46e5', fontWeight: 'bold' }}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="question-card">
        <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
        
        <h3 className="question-title">{question.question}</h3>
        
        <div>
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(index)}
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-secondary"
        >
          Previous
        </button>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={answers.some(answer => answer === null)}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
          <div
            style={{
              background: '#4f46e5',
              height: '100%',
              borderRadius: '4px',
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              transition: 'width 0.3s'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
