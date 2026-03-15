const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/profile-pic', auth, upload.single('profilePic'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;

