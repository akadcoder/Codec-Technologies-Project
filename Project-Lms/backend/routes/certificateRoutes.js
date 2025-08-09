const express = require('express');
const router = express.Router();
const { getCertificate, getUserCertificates } = require('../controllers/certificateController');
const auth = require('../middleware/auth');

router.get('/:id', getCertificate);
router.get('/user/certificates', auth, getUserCertificates);

module.exports = router;
