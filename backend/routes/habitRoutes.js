// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeHabits } = require('../habitAnalysis'); 
const { checkJwt } = require('../middleware/auth');

// router.get('/analyze/:userId', async (req, res) => {
//     console.log('Received request for habit analysis. User ID:', req.params.userId);
//     try {
//       const habitAnalysis = await analyzeHabits(req.params.userId);
//       console.log('Habit analysis completed:', habitAnalysis);
//       res.json(habitAnalysis);
//     } catch (error) {
//       console.error('Error in habit analysis:', error);
//       res.status(500).json({ message: 'Error analyzing habits', error: error.message });
//     }
//   });

router.get('/analyze/:userId', checkJwt, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the requesting user
    const requestingUser = await User.findOne({ auth0Id: req.user.sub });

    if (!requestingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the requesting user is not an admin and is not requesting their own data, deny access
    if (!requestingUser.isAdmin && requestingUser.auth0Id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const habitData = await analyzeHabits(userId);
    res.json(habitData);
  } catch (error) {
    console.error('Error in habit analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
  module.exports = router;
