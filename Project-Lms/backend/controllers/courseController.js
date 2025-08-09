const Course = require('../models/Course');
const AWS = require('aws-sdk');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name')
      .select('-videos');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('quizzes');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = req.user;

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.enrolledStudents.includes(user._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.enrolledStudents.push(user._id);
    user.enrolledCourses.push(course._id);

    await course.save();
    await user.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    // This would handle video upload to S3
    // Implementation depends on your frontend file upload
    const { title, videoFile } = req.body;
    
    // Mock S3 upload response
    const videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/videos/${Date.now()}_${title}`;
    
    res.json({ videoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
