import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from './Profile';
import Dashboard from './Dashboard';
import DailyDataForm from './DailyDataForm';
import MainScreen from './MainScreen';
import Chat from './Chat';
import Layout from './Layout';
import Calendar from './Calendar';
import Report from './Report';
import BDIQuestionnaire from './BDIQuestionnaire';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LandingPage from './LandingPage'; 

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
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && user) {
        try {
          setUserLoading(true);
          const token = await getAccessTokenSilently();
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
          userID: user.sub,
          email: user.email,
        };
        try {
          const token = await getAccessTokenSilently();
          await axios.post('http://localhost:5000/api/initUser', userData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          if (error.response && error.response.status === 200) {
            console.log('User already exists.');
          } else {
            console.error('Error initializing user:', error);
          }
        }
      }
    };
    initializeUser();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Protected routes */}
      <Route path="/main" element={isAuthenticated ? <Layout><MainScreen /></Layout> : <Navigate to="/" replace />} />
      <Route path="/daily-data" element={isAuthenticated ? <Layout><DailyDataForm /></Layout> : <Navigate to="/" replace />} />
      <Route path="/chat" element={isAuthenticated ? <Layout><Chat /></Layout> : <Navigate to="/" replace />} />
      <Route path="/profile" element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/" replace />} />
      <Route path="/calendar" element={isAuthenticated ? <Layout><Calendar /></Layout> : <Navigate to="/" replace />} />
      <Route path="/monthlyQuestionnaire" element={isAuthenticated ? <Layout><BDIQuestionnaire /></Layout> : <Navigate to="/" replace />} />

      {/* Admin routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAdmin={isAdmin} userLoading={userLoading}>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute isAdmin={isAdmin} userLoading={userLoading}>
            <Layout><Report /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
