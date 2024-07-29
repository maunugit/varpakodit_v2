// src/Layout.js
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  margin-left: 250px; /* Adjusted for sidebar width */
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  width: calc(100% - 250px); /* Adjusted for sidebar width */
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <ContentContainer>
        {children}
      </ContentContainer>
    </LayoutContainer>
  );
};

export default Layout;
