import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="card">
      <img 
        src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course+Thumbnail'} 
        alt={course.title}
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-text">{course.description}</p>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>
            ${course.price}
          </span>
          <span style={{ marginLeft: '1rem', color: '#6b7280' }}>
            {course.level}
          </span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ color: '#6b7280' }}>
            By {course.instructor?.name}
          </span>
        </div>
        <Link to={`/course/${course._id}`} className="btn btn-primary">
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
