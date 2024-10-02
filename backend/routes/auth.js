// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkJwt } = require('../middleware/auth'); 

// GET /api/auth/me
router.get('/me', checkJwt, async (req, res) => {
  try {
    // Log the req.user to verify it has the expected data
    console.log('req.user:', req.user);

    const user = await User.findOne({ auth0Id: req.user.sub });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send the user data including isAdmin
    res.json({
      auth0Id: user.auth0Id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
