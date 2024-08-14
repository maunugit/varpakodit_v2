// routes/profile.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create or update profile
router.post('/', async (req, res) => {
  console.log("POST request received at /api/profile");
  console.log("Request body:", req.body);
  try {
    let profile = await Profile.findOne({ userId: req.body.userId });
    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate({ userId: req.body.userId }, req.body, { new: true });
    } else {
      // Create new profile
      profile = new Profile(req.body);
      await profile.save();
    }
    res.status(200).send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get profile
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;