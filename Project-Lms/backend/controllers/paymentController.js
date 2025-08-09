const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Course = require('../models/Course');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        courseId,
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: course.price
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, courseId } = req.body;

    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      amount: req.body.amount,
      paymentIntentId,
      status: 'completed'
    });

    // Enroll user in course
    const course = await Course.findById(courseId);
    course.enrolledStudents.push(req.user._id);
    await course.save();

    req.user.enrolledCourses.push(courseId);
    await req.user.save();

    res.json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
