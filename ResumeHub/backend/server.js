const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

  // API routes
  app.use('/api/auth', require('./routes/auth'));

app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/resume', require('./routes/public'));

// Mongo connect
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

