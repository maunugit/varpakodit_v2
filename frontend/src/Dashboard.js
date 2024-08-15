// src/MainScreen.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import 'chart.js/auto';
import { fetchDashboardData } from './apiService';
import { useAuth0 } from '@auth0/auth0-react';

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
  const [dataEntries, setDataEntries] = useState(100); // Example data
  const [filesUploaded, setFilesUploaded] = useState(20); // Example data
  const [happinessScale, setHappinessScale] = useState(75); // Example data, scale of 0-100
  const [userEngagement, setUserEngagement] = useState(85); // Example data
  const [averageTime, setAverageTime] = useState(12); // Example data in minutes

  const [data, setData] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    dataEntries: 0,
    filesUploaded: 0,
    happinessScale: 0,
    userEngagement: 0,
    averageTime: 0,
    chartData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData(getAccessTokenSilently);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    getDashboardData();
  }, [getAccessTokenSilently]);
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // maybe render the dashboard using the "data" state??

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Data Entries',
        data: [50, 60, 70, 80, 90, 100],
        borderColor: '#ff6b6b',
        fill: false,
      },
      {
        label: 'Files Uploaded',
        data: [10, 15, 20, 25, 30, 35],
        borderColor: '#4ecdc4',
        fill: false,
      },
      {
        label: 'Happiness Scale',
        data: [60, 65, 70, 75, 80, 85],
        borderColor: '#1a535c',
        fill: false,
      },
      {
        label: 'User Engagement',
        data: [70, 75, 80, 85, 90, 95],
        borderColor: '#ffe66d',
        fill: false,
      },
    ],
  };

  return (
    <MainContainer>
      <Sidebar />
      <ContentContainer>
        <Row className="justify-content-center">
          <DashboardCard style={{ backgroundColor: cardColors[0] }}>
            <Card.Body>
              <Card.Title>Data Entries</Card.Title>
              <Card.Text>{dashboardData.dataEntries}</Card.Text>
            </Card.Body>
          </DashboardCard>
          <DashboardCard style={{ backgroundColor: cardColors[1] }}>
            <Card.Body>
              <Card.Title>Files Uploaded</Card.Title>
              <Card.Text>{dashboardData.filesUploaded}</Card.Text>
            </Card.Body>
          </DashboardCard>
          <DashboardCard style={{ backgroundColor: cardColors[2] }}>
            <Card.Body>
              <Card.Title>Happiness Scale</Card.Title>
              <Card.Text>{dashboardData.happinessScale}%</Card.Text>
            </Card.Body>
          </DashboardCard>
          <DashboardCard style={{ backgroundColor: cardColors[3] }}>
            <Card.Body>
              <Card.Title>User Engagement</Card.Title>
              <Card.Text>{dashboardData.userEngagement}%</Card.Text>
            </Card.Body>
          </DashboardCard>
          <DashboardCard style={{ backgroundColor: cardColors[4] }}>
            <Card.Body>
              <Card.Title>Average Time</Card.Title>
              <Card.Text>{dashboardData.averageTime} mins</Card.Text>
            </Card.Body>
          </DashboardCard>
        </Row>
        <GraphContainer>
          <Card>
            <Card.Body>
              <Card.Title>Performance Graph</Card.Title>
              <Line data={dashboardData.chartData} options={{ maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </GraphContainer>
      </ContentContainer>
    </MainContainer>
  );
};

export default Dashboard;
