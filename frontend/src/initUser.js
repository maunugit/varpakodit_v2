// Example using React and Auth0's useAuth0 hook
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated && user) {
        const userData = {
          userID: user.sub, // Auth0's unique user identifier
          email: user.email,
        };

        try {
          await axios.post('/api/initUser', userData);
          console.log('User initialized successfully');
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
    };

    initializeUser();
  }, [isAuthenticated, user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Your application components */}
    </div>
  );
};

export default App;
