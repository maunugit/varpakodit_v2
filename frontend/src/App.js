// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import Dashboard from './Dashboard'
import DailyDataForm from './DailyDataForm';
import MainScreen from './MainScreen';
import Chat from './Chat';
import Layout from './Layout';
import Calendar from './Calendar';
import Report from './Report';
import BDIQuestionnaire from './BDIQuestionnaire';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ProtectedRoute = ({ isAdmin, userLoading, children }) => {
  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  // const { isAuthenticated, isLoading, error } = useAuth0();

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Oops... {error.message}</div>;
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          setUserLoading(true);
          // Obtain the access token
          const token = await getAccessTokenSilently();
  
          // Make an authenticated request to the backend
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          console.log('User data from backend:', response.data);
  
          // Set the isAdmin state
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };
  
    fetchUser();
  }, [isAuthenticated, getAccessTokenSilently, user]);
  

  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated && user) {
        const userData = {
          userID: user.sub, // Auth0's unique user identifier
          email: user.email,
        };

        try {
          // Obtain the access token
          const token = await getAccessTokenSilently();

          // Send a POST request to initialize the user
          const response = await axios.post('http://localhost:5000/api/initUser', userData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('User initialization response:', response.data);
        } catch (error) {
          // Handle errors (e.g., user already exists)
          if (error.response && error.response.status === 200) {
            console.log('User already exists. No action needed.');
          } else {
            console.error('Error initializing user:', error);
          }
        }
      }
    };

    initializeUser();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return (
    <Router>
      <div>
        <LoginButton />
        <LogoutButton />
      </div>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Layout><MainScreen /></Layout> : <Profile />} />
        
        <Route path="/daily-data" element={<Layout><DailyDataForm /></Layout>} />
        <Route path="/chat" element={<Layout><Chat /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar/></Layout>} />
        <Route path="/monthlyQuestionnaire" element={<Layout><BDIQuestionnaire/></Layout>} />
        <Route path="/logout" element={<Layout><LogoutButton/></Layout>} />
        
         {/* Admin Routes */}
         <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <Layout><Report /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Optional: Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
};

export default App;
