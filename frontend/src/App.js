// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import DailyDataForm from './DailyDataForm';
import MainScreen from './MainScreen';
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
        {isAuthenticated && <Profile />}
        {/* {isAuthenticated}
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/daily-data" element={<DailyDataForm />} />
        </Routes> */}
      </div>
      <Routes>
        <Route path="/" element={isAuthenticated ? <MainScreen /> : <Profile />} />
        <Route path="/daily-data" element={<DailyDataForm />} />
      </Routes>
    </Router>
  );
};

export default App;
