import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe('your_stripe_publishable_key_here');

const PaymentForm = ({ course, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    setError('');
    
    try {
      // Create payment intent
      const { data } = await api.post('/payments/create-intent', {
        courseId: course._id
      });
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );
      
      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await api.post('/payments/confirm', {
          paymentIntentId: paymentIntent.id,
          courseId: course._id,
          amount: data.amount
        });
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handlePayment}>
      <div style={{ marginBottom: '1rem' }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        {processing ? 'Processing...' : `Pay $${course.price}`}
      </button>
    </form>
  );
};

const CoursePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course && user) {
      setIsEnrolled(course.enrolledStudents.includes(user._id));
    }
  }, [course, user]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (course.price > 0) {
      setShowPayment(true);
    } else {
      try {
        await api.post(`/courses/${id}/enroll`);
        setIsEnrolled(true);
      } catch (error) {
        console.error('Error enrolling:', error);
      }
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsEnrolled(true);
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (course.quizzes.length > 0) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (result) => {
    setQuizResult(result);
    setShowQuiz(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="container">Course not found</div>;
  }

  if (showQuiz && course.quizzes.length > 0) {
    return (
      <QuizComponent
        quizId={course.quizzes[0]._id}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="grid grid-2">
        {/* Main Content */}
        <div>
          <h1>{course.title}</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            By {course.instructor.name}
          </p>
          <p style={{ marginBottom: '2rem' }}>{course.description}</p>
          
          {isEnrolled && course.videos.length > 0 && (
            <VideoPlayer
              video={course.videos[currentVideoIndex]}
              onVideoEnd={handleVideoEnd}
            />
          )}
          
          {quizResult && (
            <div className="alert alert-success">
              <h3>Quiz Completed!</h3>
              <p>Score: {quizResult.score}/{quizResult.totalPoints}</p>
              <p>Percentage: {quizResult.percentage}%</p>
              {quizResult.passed && (
                <p>🎉 Congratulations! You passed the quiz!</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card">
            <div className="card-content">
              <h3 style={{ marginBottom: '1rem' }}>Course Details</h3>
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Students:</strong> {course.enrolledStudents.length}</p>
              
              {!isAuthenticated ? (
                <p style={{ color: '#ef4444', marginTop: '1rem' }}>
                  Please login to enroll in this course
                </p>
              ) : !isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {course.price > 0 ? `Enroll for $${course.price}` : 'Enroll for Free'}
                </button>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  <div className="alert alert-success">
                    ✅ You are enrolled in this course
                  </div>
                  
                  {course.videos.length > 0 && (
                    <div>
                      <h4>Videos</h4>
                      {course.videos.map((video, index) => (
                        <div
                          key={index}
                          onClick={() => setCurrentVideoIndex(index)}
                          style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: currentVideoIndex === index ? '#eff6ff' : 'transparent',
                            borderRadius: '0.25rem',
                            marginBottom: '0.25rem'
                          }}
                        >
                          📹 {video.title}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {course.quizzes.length > 0 && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="btn btn-secondary"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px' }}>
            <div className="card-content">
              <h3>Complete Payment</h3>
              <p>Course: {course.title}</p>
              <p>Amount: ${course.price}</p>
              
              <Elements stripe={stripePromise}>
                <PaymentForm course={course} onSuccess={handlePaymentSuccess} />
              </Elements>
              
              <button
                onClick={() => setShowPayment(false)}
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
