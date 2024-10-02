
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

//    // Create or update user profile
//    router.post('/profile', async (req, res) => {
//      try {
//        const { sub, email, name } = req.body;
//        let user = await User.findOne({ auth0Id: sub });

//        if (user) {
//          user.email = email;
//          user.name = name;
//          user.updatedAt = Date.now();
//        } else {
//          user = new User({
//            auth0Id: sub,
//            email,
//            name
//          });
//        }

//        await user.save();
//        res.status(200).json(user);
//      } catch (error) {
//        console.error('Error in user profile route:', error);
//        res.status(500).json({ error: 'Internal server error' });
//      }
//    });

//    // Get user profile
//    router.get('/profile', async (req, res) => {
//      try {
//        const user = await User.findOne({ auth0Id: req.query.auth0Id });
//        if (!user) {
//          return res.status(404).json({ error: 'User not found' });
//        }
//        res.status(200).json(user);
//      } catch (error) {
//        console.error('Error fetching user profile:', error);
//        res.status(500).json({ error: 'Internal server error' });
//      }
//    });

//    // Admin route: Get all users
//    router.get('/admin/users', async (req, res) => {
//      try {
//        const users = await User.find({}, '-__v');
//        res.status(200).json(users);
//      } catch (error) {
//        console.error('Error fetching all users:', error);
//        res.status(500).json({ error: 'Internal server error' });
//      }
//    });

//    // Admin route: Update user role
//    router.put('/admin/users/:userId/role', async (req, res) => {
//      try {
//        const { userId } = req.params;
//        const { role } = req.body;
//        const user = await User.findByIdAndUpdate(
//          userId,
//          { role, updatedAt: Date.now() },
//          { new: true }
//        );

//        if (!user) {
//          return res.status(404).json({ error: 'User not found' });
//        }

//        res.status(200).json(user);
//      } catch (error) {
//        console.error('Error updating user role:', error);
//        res.status(500).json({ error: 'Internal server error' });
//      }
//    });

//    module.exports = router;