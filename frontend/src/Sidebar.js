import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';  // Import useAuth0 to handle logout

const SidebarContainer = styled.div`
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1f1f1f;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-top: 20px;
  padding-left: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarButton = styled.button`
  margin: 10px 0;
  padding: 10px 20px;
  width: calc(100% - 40px);
  text-align: left;
  background: none;
  border: none;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;

  &:hover {
    background-color: #333333;
    color: #ffffff;
  }

  &:focus {
    outline: none;
  }
`;

const LogoutButton = styled(SidebarButton)`
  color: #ff4d4d;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();  // Destructure logout from useAuth0

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });  // Auth0 logout with redirection to landing page
  };

  return (
    <SidebarContainer>
      <SidebarButton onClick={() => navigate('/profile')}>Profile</SidebarButton>
      <SidebarButton onClick={() => navigate('/daily-data')}>Fill Daily Data</SidebarButton>
      <SidebarButton onClick={() => navigate('/chat')}>Talk to a Virtual Assistant</SidebarButton>
      <SidebarButton onClick={() => navigate('/dashboard')}>Dashboard</SidebarButton>
      <SidebarButton onClick={() => navigate('/calendar')}>Calendar</SidebarButton>
      <SidebarButton onClick={() => navigate('/report')}>Download Report</SidebarButton>
      <SidebarButton onClick={() => navigate('/monthlyQuestionnaire')}>Fill Monthly Questionnaire</SidebarButton>
      <SidebarButton onClick={() => navigate('/rbdiQuestionnaire')}>Fill R-BDI Questionnaire</SidebarButton>
      <SidebarButton onClick={() => navigate('/settings')}>My Settings</SidebarButton>
      
      {/* Use the handleLogout function to log out */}
      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;