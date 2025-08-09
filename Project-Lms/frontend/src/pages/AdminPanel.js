import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: 'beginner',
    videos: [{ title: '', url: '' }]
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...newCourse.videos];
    updatedVideos[index][field] = value;
    setNewCourse(prev => ({
      ...prev,
      videos: updatedVideos
    }));
  };

  const addVideoField = () => {
    setNewCourse(prev => ({
      ...prev,
      videos: [...prev.videos, { title: '', url: '' }]
    }));
  };

  const removeVideoField = (index) => {
    if (newCourse.videos.length > 1) {
      const updatedVideos = newCourse.videos.filter((_, i) => i !== index);
      setNewCourse(prev => ({
        ...prev,
        videos: updatedVideos
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', newCourse);
      setNewCourse({
        title: '',
        description: '',
        price: 0,
        category: '',
        level: 'beginner',
        videos: [{ title: '', url: '' }]
      });
      setShowAddForm(false);
      fetchCourses();
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1>Instructor Panel</h1>
      
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="btn btn-primary"
        style={{ marginBottom: '2rem' }}
      >
        {showAddForm ? 'Cancel' : 'Add New Course'}
      </button>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-content">
            <h2>Create New Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  required
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={newCourse.price}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newCourse.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Level</label>
                <select
                  name="level"
                  value={newCourse.level}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Videos</label>
                {newCourse.videos.map((video, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Video title"
                      value={video.title}
                      onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="url"
                      placeholder="Video URL"
                      value={video.url}
                      onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                      className="form-input"
                      style={{ flex: 2 }}
                    />
                    {newCourse.videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideoField(index)}
                        className="btn btn-secondary"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVideoField}
                  className="btn btn-secondary"
                >
                  Add Video
                </button>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}

      <h2>My Courses</h2>
      <div className="grid grid-3">
        {courses.map(course => (
          <div key={course._id} className="card">
            <div className="card-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Students:</strong> {course.enrolledStudents.length}</p>
              <p><strong>Status:</strong> {course.isPublished ? 'Published' : 'Draft'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
