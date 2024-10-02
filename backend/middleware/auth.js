const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// JWT Middleware to validate tokens
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Middleware to handle user creation/updating
const handleUser = async (req, res, next) => {
  const { sub, email, name } = req.user; // 'sub' is the unique user ID in Auth0

  // Debugging: Log incoming user info
  console.log('Authenticated user:', sub, email, name);

  try {
    // Find the user by Auth0 sub
    let user = await User.findOne({ auth0Id: sub });

    if (!user) {
      // If user does not exist, create a new one
      user = new User({
        auth0Id: sub,
        email: email,
        name: name || email, // Use name if available, else email
        // role: 'user', // Default is 'user' as per schema
      });

      await user.save();
      console.log(`New user created: ${user.name}`);
    } else {
      // Optionally, update user info if needed
      user.email = email;
      user.name = name || email;
      await user.save();
      console.log(`Existing user updated: ${user.name}`);
    }

    // Attach the user document to the request for further use
    req.dbUser = user;

    next();
  } catch (error) {
    console.error('Error handling user:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { checkJwt, handleUser };
