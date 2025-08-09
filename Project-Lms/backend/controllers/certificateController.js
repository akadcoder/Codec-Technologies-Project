const Certificate = require('../models/Certificate');

exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name')
      .populate('course', 'title');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('course', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
