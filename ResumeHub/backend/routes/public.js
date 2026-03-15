const express = require('express');
const Resume = require('../models/Resume');
const router = express.Router();

// Public resume view
router.get('/:username/:resumeId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, public: true });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Serve as HTML
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resume.personalInformation.fullName || 'Resume'}</title>

        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <div id="resume-preview">${resume.summary || 'Resume preview content'}</div>
</xai:function_call name="edit_file"> 

<xai:function_call name="edit_file">
<parameter name="path">TODO.md
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

