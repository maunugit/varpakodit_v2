import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import { Chart } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, LineController, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ChartTitle,
  Tooltip,
  Legend
);
const ReportContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

const Button = styled.button`
  background-color: #6200ee;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3700b3;
  }
`;

const ReportContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const ReportTitle = styled.h2`  // Changed from Title to ReportTitle
  text-align: center;
  color: #333;
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  color: #6200ee;
`;

const FeedbackInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin: 20px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  font-family: Arial, sans-serif;
`;

const Report = ({ reportDate }) => {
  const { t } = useTranslation();
  const { getAccessTokenSilently } = useAuth0();
  const [feedback, setFeedback] = useState('');
  const [studentData, setStudentData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    grade: '',
  });
  const [habitData, setHabitData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Fetch users list on component mount
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

  // Fetch selected user's data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedUserId) {
        try {
          const token = await getAccessTokenSilently();
          const headers = {
            Authorization: `Bearer ${token}`
          };

          // Get user's profile data
          const profileResponse = await axios.get(
            `http://localhost:5000/api/profile/${selectedUserId}`,
            { headers }
          );
          
          const selectedUser = users.find(u => u.auth0Id === selectedUserId);
          
          if (profileResponse.data) {
            setStudentData(prevData => ({
              ...prevData,
              name: selectedUser?.email || 'Unknown',
              age: profileResponse.data.age,
              weight: profileResponse.data.weight,
              height: profileResponse.data.height,
              grade: profileResponse.data.grade,
            }));
          }

          // Fetch habit data
          try {
            const habitResponse = await axios.get(
              `http://localhost:5000/api/habits/analyze/${selectedUserId}`,
              { headers }
            );
            setHabitData(habitResponse.data);
          } catch (habitError) {
            console.error('Error fetching habit data:', habitError);
            setHabitData([]);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          setStudentData({
            name: '',
            age: '',
            weight: '',
            height: '',
            grade: '',
          });
        }
      }
    };

    fetchData();
  }, [selectedUserId, users, getAccessTokenSilently]);

  // Handler for user selection
  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
    setFeedback('');
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let yOffset = 30;

    // Title and Date
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(t('report_title'), pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Päivämäärä: ${reportDate}`, margin, yOffset);
    yOffset += 20;

    // Student Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Käyttäjän tiedot', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nimi: ${studentData.name}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Ikä: ${studentData.age}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Paino: ${studentData.weight} kg`, margin, yOffset);
    yOffset += 10;
    doc.text(`Pituus: ${studentData.height} cm`, margin, yOffset);
    yOffset += 10;
    doc.text(`Luokka: ${studentData.grade}`, margin, yOffset);
    yOffset += 20;

    // Habit Analysis
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Käyttäjän analyysi', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Add each habit analysis entry
    habitData.forEach((habit) => {
      const habitText = `${t(`habitTitles.${habit.key}`)}: ${t(`habitValues.${habit.value}`, { defaultValue: habit.value })}`;
      doc.text(habitText, margin, yOffset);
      yOffset += 10;

      // Check if we need a new page
      if (yOffset > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yOffset = 20;
      }
    });

    yOffset += 10;

    // Chart
    const canvas = document.createElement('canvas');
    canvas.width = pageWidth;
    canvas.height = 200;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: ['Viikko 1', 'Viikko 2', 'Viikko 3', 'Viikko 4'],
        datasets: [
          { 
            label: 'Merkinnät', 
            data: [65, 59, 80, 81], 
            borderColor: '#FF6384',
            tension: 0.1,
            fill: false 
          },
          { 
            label: 'Unen laatu', 
            data: [28, 48, 40, 19], 
            borderColor: '#36A2EB',
            tension: 0.1,
            fill: false 
          },
          { 
            label: 'Mieliala', 
            data: [88, 77, 90, 96], 
            borderColor: '#4BC0C0',
            tension: 0.1,
            fill: false 
          }
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
            type: 'linear'
          },
          x: {
            type: 'category'
          }
        },
        plugins: {
          legend: { 
            display: true,
            position: 'top'
          },
          datalabels: {
            display: true,
            color: 'black',
          }
        }
      }
    });

    const chartCanvas = await html2canvas(canvas);
    const chartImgData = chartCanvas.toDataURL('image/png');
    const chartImgHeight = (chartCanvas.height * pageWidth) / chartCanvas.width;
    

    // Check if we need a new page for the chart
    if (yOffset + chartImgHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yOffset = 20;
    }

    doc.addImage(chartImgData, 'PNG', margin, yOffset, pageWidth, chartImgHeight);
    document.body.removeChild(canvas);
    yOffset += chartImgHeight + 20;

    // Additional Remarks
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Lisätiedot', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(feedback || 'Ei lisätietoja', margin, yOffset);

    // Split feedback into lines if it's too long
    const feedbackText = feedback || 'Ei lisätietoja';
    const splitFeedback = doc.splitTextToSize(feedbackText, pageWidth - (margin * 2));
    doc.text(splitFeedback, margin, yOffset);

    doc.save('Varpakodit_Raportti.pdf');
  };

  return (
    <ReportContainer>
      <UserSelectContainer>
        <Select 
          value={selectedUserId} 
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.auth0Id} value={user.auth0Id}>
              {user.email}
            </option>
          ))}
        </Select>
      </UserSelectContainer>

      {selectedUserId ? (
        <>
          <FeedbackInput
            placeholder="Kirjoita palaute tähän..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <ReportContent>
            <ReportTitle>VARPAKODIT käyttäjäraportti</ReportTitle>
            <p><strong>Päivämäärä:</strong> {reportDate}</p>

            <SectionTitle>Student Information</SectionTitle>
            <p><strong>Nimi:</strong> {studentData.name}</p>
            <p><strong>Ikä:</strong> {studentData.age}</p>
            <p><strong>Paino:</strong> {studentData.weight} kg</p>
            <p><strong>Pituus:</strong> {studentData.height} cm</p>
            <p><strong>Luokka:</strong> {studentData.grade}</p>

            <SectionTitle>Käyttäjän analyysi</SectionTitle>
            {habitData.map((habit, index) => (
              <p key={index}>
                <strong>{t(`habitTitles.${habit.key}`)}:</strong> 
                {t(`habitValues.${habit.value}`, { defaultValue: habit.value })}
              </p>
            ))}
            
            <SectionTitle>Lisätiedot</SectionTitle>
            <p>{feedback || t('no_additional_remarks')}</p>
            <Button onClick={generatePDF}>Lataa PDF-raportti</Button>
          </ReportContent>
        </>
      ) : (
        <p>Select a user to generate a report</p>
      )}
    </ReportContainer>
  );
};


const reportDate = new Date().toLocaleDateString();

const App = () => (
  <div>
    <h1>Student Reports</h1>
    <Report reportDate={reportDate} />
  </div>
);

export default App;