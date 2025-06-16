const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require("dotenv");
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


  
// Helmet security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://whephiwums.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      connectSrc: ["'self'", process.env.REACT_APP_API_URL],
      imgSrc: ["'self'", "data:"]
    }
  })
);

// Allow frontend access
app.use(cors({
  origin: 'https://akemidids.vercel.app',
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server regardless
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
