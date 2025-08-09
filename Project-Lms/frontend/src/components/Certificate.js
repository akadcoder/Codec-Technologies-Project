import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const Certificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const response = await api.get(`/certificates/${id}`);
      setCertificate(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!certificate) {
    return <div className="container">Certificate not found</div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="certificate">
        <div className="certificate-header">
          🎓 Certificate of Completion
        </div>
        
        <div className="certificate-content">
          <p>This is to certify that</p>
          
          <div className="certificate-name">
            {certificate.user.name}
          </div>
          
          <p>has successfully completed the course</p>
          
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
            "{certificate.course.title}"
          </div>
          
          <p>with a score of {certificate.percentage}%</p>
          
          <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
            <p>Certificate Number: {certificate.certificateNumber}</p>
            <p>Date Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={handlePrint} className="btn btn-primary">
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
