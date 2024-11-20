import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Styled Components
const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const UserSelectContainer = styled.div`
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 280px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 16px;
  }
  
  .value {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
  }
`;

const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  height: 400px;
`;

const DetailsSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Dashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const translationMap = {
    // Eating translations
    bad: 'Huono',
    okay: 'Kohtalainen',
    good: 'Hyvä',
    // Mood translations if needed
    'No data': 'Ei tietoja',
    // Add any other translations you need
  };

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await api.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [getAccessTokenSilently]);

  // Fetch dashboard data for selected user
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedUserId) return;
      
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Fetch data using your existing routes
        const [dailyData, bdiData] = await Promise.all([
          api.get(`/api/dailyData/${selectedUserId}`, { headers }),
          api.get(`/api/bdiQuestionnaire/${selectedUserId}`, { headers })
        ]);

        // Process the data
        const processedData = {
          totalEntries: dailyData.data.length,
          latestBDI: bdiData.data[0]?.totalScore || null,
          bdiCategory: bdiData.data[0]?.category || 'No data',
          averageSleep: calculateAverageSleep(dailyData.data),
          moodTrend: calculateMoodTrend(dailyData.data),
          trendData: generateTrendData(dailyData.data, bdiData.data),
          latestEating: dailyData.data[0]?.eating || 'No data'
        };

        setDashboardData(processedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedUserId, getAccessTokenSilently]);

  // Helper functions
  const calculateAverageSleep = (data) => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, entry) => acc + (entry.sleep || 0), 0);
    return (sum / data.length).toFixed(1);
  };

  const calculateMoodTrend = (data) => {
    const recentMoods = data.slice(0, 7).map(entry => entry.generalMood);
    const moodCounts = recentMoods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data';
  };

  const generateTrendData = (dailyData, bdiData) => {
    return dailyData.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      sleep: entry.sleep,
      mood: moodToNumber(entry.generalMood),
      bdi: getBDIScoreForDate(bdiData, entry.date)
    })).reverse().slice(0, 30); // Last 30 entries
  };

  const moodToNumber = (mood) => {
    const moodMap = { 'bad': 1, 'okay': 2, 'good': 3 };
    return moodMap[mood?.toLowerCase()] || 0;
  };

  const getBDIScoreForDate = (bdiData, date) => {
    return bdiData.find(bdi => 
      new Date(bdi.date).toDateString() === new Date(date).toDateString()
    )?.totalScore || null;
  };

  return (
    <DashboardContainer>
      <UserSelectContainer>
        <Select 
          value={selectedUserId} 
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Valitse käyttäjä</option>
          {users.map((user) => (
            <option key={user.auth0Id} value={user.auth0Id}>
              {user.email}
            </option>
          ))}
        </Select>
      </UserSelectContainer>

      {loading ? (
        <div>Loading...</div>
      ) : dashboardData ? (
        <>
          <StatsGrid>
            <StatCard>
              <h3>Datan lähettäminen</h3>
              <div className="value">{dashboardData.totalEntries}</div>
              <div className="subtitle">Lähetetyn datan määrä</div>
            </StatCard>

            <StatCard>
              <h3>Viimeisin BDI tulos</h3>
              <div className="value">{dashboardData.latestBDI || 'Ei tietoja'}</div>
              <div className="subtitle">{dashboardData.bdiCategory}</div>
            </StatCard>

            <StatCard>
              <h3>Unen laatu (keskimäärin)</h3>
              <div className="value">{dashboardData.averageSleep}/5</div>
              <div className="subtitle">Viimeiset 30 päivää</div>
            </StatCard>

            <StatCard>
              <h3>Mieliala</h3>
              <div className="value">{translationMap[dashboardData.moodTrend] || dashboardData.moodTrend}</div>
              <div className="subtitle">Yleisin mieliala viime aikoina</div>
            </StatCard>
          </StatsGrid>

          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#8884d8" 
                  name="Unen laatu"
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#82ca9d" 
                  name="Yleisvointi"
                />
                <Line 
                  type="monotone" 
                  dataKey="bdi" 
                  stroke="#ffc658" 
                  name="BDI tulos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <DetailsSection>
            <h3>Ruokailun laatu viime aikoina</h3>
            <p>{translationMap[dashboardData.latestEating] || dashboardData.latestEating}</p>
          </DetailsSection>
        </>
      ) : (
        <p>Valitse käyttäjä jonka tiedot haluat nähdä</p>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;