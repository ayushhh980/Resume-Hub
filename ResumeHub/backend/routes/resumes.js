const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /user-resumes
router.get('/user-resumes', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /create-resume
router.post('/create-resume', auth, async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, userId: req.user.id, public: true });
    await resume.save();
    res.status(201).json(resume);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /update-resume/:id
router.put('/update-resume/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /delete-resume/:id
router.delete('/delete-resume/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

