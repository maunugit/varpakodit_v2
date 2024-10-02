// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkJwt } = require('../middleware/auth');

// GET /api/users
router.get('/', checkJwt, async (req, res) => {
  try {
    // Fetch the user from the database using Auth0 ID
    const requestingUser = await User.findOne({ auth0Id: req.user.sub });

    if (!requestingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the requesting user is an admin
    if (!requestingUser.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch all users
    const users = await User.find({}, 'auth0Id email name'); // limit?

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
