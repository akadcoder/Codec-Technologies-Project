import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's enrolled courses
      const coursesResponse = await api.get('/courses');
      const userCourses = coursesResponse.data.filter(course =>
        course.enrolledStudents.includes(user._id)
      );
      setEnrolledCourses(userCourses);

      // Fetch user's certificates
      const certificatesResponse = await api.get('/certificates/user/certificates');
      setCertificates(certificatesResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1>My Dashboard</h1>
      
      <div className="grid grid-2">
        {/* Enrolled Courses */}
        <div>
          <h2>My Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p>You haven't enrolled in any courses yet.</p>
          ) : (
            <div>
              {enrolledCourses.map(course => (
                <div key={course._id} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-content">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <Link to={`/course/${course._id}`} className="btn btn-primary">
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates */}
        <div>
          <h2>My Certificates</h2>
          {certificates.length === 0 ? (
            <p>Complete courses and pass quizzes to earn certificates!</p>
          ) : (
            <div>
              {certificates.map(certificate => (
                <div key={certificate._id} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-content">
                    <h3>{certificate.course.title}</h3>
                    <p>Score: {certificate.percentage}%</p>
                    <p>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
                    <Link to={`/certificate/${certificate._id}`} className="btn btn-primary">
                      View Certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
