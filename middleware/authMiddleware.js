const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "700d" });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.comparePassword(password))) {
    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.comparePassword(password))) {
    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = { protect };