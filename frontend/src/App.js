// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Oops... {error.message}</div>;

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
        <Route path="/dashboard" element={<Layout>< Dashboard/></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar/></Layout>} />
        <Route path="/report" element={<Layout><Report/></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
