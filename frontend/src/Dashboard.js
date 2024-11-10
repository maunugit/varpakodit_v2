// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import 'chart.js/auto';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

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

const DashboardCard = styled(Card)`
  width: 18rem;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-10px);
  }
`;

const cardColors = ['#ff6b6b', '#4ecdc4', '#1a535c', '#ffe66d', '#ffa69e'];

const GraphContainer = styled.div`
  width: 100%;
  height: 60vh; /* Increased height */
  padding: 20px;
`;

const Dashboard = () => {
  // const [dataEntries, setDataEntries] = useState(100); // Example data
  // const [filesUploaded, setFilesUploaded] = useState(20); // Example data
  // const [happinessScale, setHappinessScale] = useState(75); // Example data, scale of 0-100
  // const [userEngagement, setUserEngagement] = useState(85); // Example data
  // const [averageTime, setAverageTime] = useState(12); // Example data in minutes

  const { isAuthenticated, user } = useAuth0();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getHappinessInterpretation = (scale) => {
    if (scale <= 20) return "Very Unhappy";
    if (scale <= 40) return "Unhappy";
    if (scale <= 60) return "Neutral";
    if (scale <= 80) return "Happy";
    return "Very Happy";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:5000/api/dashboard/${user.sub}`);
          console.log("Raw dashboard data:", response.data);
          setDashboardData(response.data);
        } catch (error) {
          setError('Error fetching dashboard data');
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!dashboardData) return null;

  const { dataEntries, happinessScale, userEngagement, averageTime, chartData } = dashboardData;


  return (
    <MainContainer>
      <Sidebar />
      <ContentContainer>
        <Row className="justify-content-center">
          <DashboardCard style={{ backgroundColor: cardColors[0] }}>
            <Card.Body>
              <Card.Title>Data Entries</Card.Title>
              <Card.Text>{dataEntries}</Card.Text> 
            </Card.Body>
          </DashboardCard>
          
          <DashboardCard style={{ backgroundColor: cardColors[1] }}>
          <Card.Body>
            <Card.Title>Happiness Scale</Card.Title>
            <Card.Text>{happinessScale}% - {getHappinessInterpretation(happinessScale)}</Card.Text>
          </Card.Body>
        </DashboardCard>

          <DashboardCard style={{ backgroundColor: cardColors[2] }}>
            <Card.Body>
              <Card.Title>User Engagement</Card.Title>
              <Card.Text>{userEngagement}%</Card.Text>
            </Card.Body>
          </DashboardCard>
          <DashboardCard style={{ backgroundColor: cardColors[3] }}>
            <Card.Body>
              <Card.Title>Average Time</Card.Title>
              <Card.Text>{averageTime} mins</Card.Text>
            </Card.Body>
          </DashboardCard>
        </Row>
        <GraphContainer>
          <Card>
            <Card.Body>
              <Card.Title>Performance Graph</Card.Title>
              <Line data={chartData} options={{ maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </GraphContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Dashboard;
