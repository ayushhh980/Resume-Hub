const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInformation: {
    fullName: String,
    professionalTitle: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    github: String,
    personalWebsite: String
  },
  summary: String,
  education: [{
    degree: String,
    field: String,
    institution: String,
    startYear: String,
    endYear: String,
    cgpa: String,
    description: String
  }],
  experience: [{
    jobTitle: String,
    company: String,
    employmentType: String,
    startDate: String,
    endDate: String,
    description: String,
    achievements: String
  }],
  skills: [String],
  projects: [{
    title: String,
    description: String,
    technologies: String,
    link: String,
    duration: String
  }],
  certifications: [{
    name: String,
    organization: String,
    issueDate: String,
    credentialUrl: String
  }],
  achievements: [String],
  languages: [String],
  portfolio: [{
    title: String,
    description: String,
    link: String
  }],
  templateType: String,
  colorTheme: String,
  fontStyle: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);

