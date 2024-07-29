// src/MainScreen.js
import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import Sidebar from './Sidebar';

// Styled components
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
`;

const ContentContainer = styled(Container)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const WelcomeMessage = styled.h1`
  font-size: 36px;
  color: #343a40;
  margin-bottom: 20px;
  text-align: center;
`;

const SubMessage = styled.p`
  font-size: 18px;
  color: #6c757d;
  text-align: center;
`;

const MainScreen = () => {
  return (
    <MainContainer>
      <Sidebar />
      <ContentContainer>
        <WelcomeMessage>Welcome!</WelcomeMessage>
        <SubMessage>Select from the sidebar to get started:</SubMessage>
      </ContentContainer>
    </MainContainer>
  );
};

export default MainScreen;
