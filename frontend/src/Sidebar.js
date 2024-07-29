// src/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  height: 100vh;
  width: 250px; /* Adjusted width for a more modern look */
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
  width: calc(100% - 40px); /* Adjusted width for padding */
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

  return (
    <SidebarContainer>
      <SidebarButton onClick={() => navigate('/profile')}>Profile</SidebarButton>
      <SidebarButton onClick={() => navigate('/daily-data')}>Fill Daily Data</SidebarButton>
      <SidebarButton onClick={() => navigate('/chat')}>Talk to a Virtual Assistant</SidebarButton>
      <SidebarButton onClick={() => navigate('/dashboard')}>Dashboard</SidebarButton>
      <SidebarButton onClick={() => navigate('/calendar')}>Calendar</SidebarButton>
      <SidebarButton onClick={() => navigate('/report')}>Download Report</SidebarButton>
      <SidebarButton onClick={() => navigate('/settings')}>My Settings</SidebarButton>
      <LogoutButton onClick={() => console.log('Logout')}>Log Out</LogoutButton>
    </SidebarContainer>
  );
};
 
export default Sidebar;
