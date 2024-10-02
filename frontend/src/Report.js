import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const ReportContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

const Title = styled.h2`
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

const Report = ({reportDate }) => {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [studentData, setStudentData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    grade: '',
  });

  const [habitData, setHabitData] = useState([]);

  const { user, isAuthenticated, getAccessTokenSilently  } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            audience: 'YOUR_AUTH0_AUDIENCE',
          });

          // Fetch the logged-in user's data to check if they are an admin
          const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setIsAdmin(userResponse.data.isAdmin);

          if (userResponse.data.isAdmin) {
            // Fetch all users
            const usersResponse = await axios.get('http://localhost:5000/api/users', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            setUsers(usersResponse.data);
          }

          // Set the default selected user ID
          setSelectedUserId(user.sub);

          // Fetch report data for the selected user
          fetchReportData(token, user.sub);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const fetchReportData = async (token, userId) => {
    try {
      // Fetch profile data
      const profileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.data) {
        setStudentData((prevData) => ({
          ...prevData,
          name: profileResponse.data.name || 'N/A',
          age: profileResponse.data.age || 'N/A',
          weight: profileResponse.data.weight || 'N/A',
          height: profileResponse.data.height || 'N/A',
          grade: profileResponse.data.grade || 'N/A',
          // attendance here if necessary
        }));
      }

      // Fetch habit analysis
      const habitResponse = await axios.get(
        `http://localhost:5000/api/habits/analyze/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabitData(habitResponse.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    getAccessTokenSilently({
      audience: 'YOUR_AUTH0_AUDIENCE',
    }).then((token) => {
      fetchReportData(token, userId);
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let yOffset = 30;

    // Title and Date
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VARPAKODIT Student Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Date: ${reportDate}`, margin, yOffset);
    yOffset += 20;

    // Student Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${studentData.name}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Age: ${studentData.age}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Weight: ${studentData.weight} kg`, margin, yOffset);
    yOffset += 10;
    doc.text(`Height: ${studentData.height} cm`, margin, yOffset);
    yOffset += 10;
    doc.text(`Grade: ${studentData.grade}`, margin, yOffset);
    yOffset += 10;
    

    // Habits and Events
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Habit Analysis', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    habitData.forEach((habit) => {
      doc.text(`${habit.title}: ${habit.value}`, margin, yOffset);
      yOffset += 10;
    });
    yOffset += 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Events Attended', margin, yOffset);
    yOffset += 10;
    
    // Additional Remarks
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Remarks', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('This section can include any additional comments or insights.', margin, yOffset);
    yOffset += 20;

    // Feedback
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('User Feedback', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(feedback, margin, yOffset);
    yOffset += 20;

    // Chart
    const canvas = document.createElement('canvas');
    canvas.width = pageWidth;
    canvas.height = 200;
    document.body.appendChild(canvas);

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          { label: 'Data Entries', data: [65, 59, 80, 81], borderColor: '#FF6384', fill: false },
          { label: 'Files Uploaded', data: [28, 48, 40, 19], borderColor: '#36A2EB', fill: false },
          { label: 'Happiness Scale', data: [88, 77, 90, 96], borderColor: '#4BC0C0', fill: false },
          { label: 'User Engagement', data: [65, 75, 70, 85], borderColor: '#FFCE56', fill: false },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: {
          legend: { display: true },
          datalabels: {
            display: true,
            color: 'black',
          },
        },
      },
    });

    const chartCanvas = await html2canvas(canvas);
    const chartImgData = chartCanvas.toDataURL('image/png');
    const chartImgHeight = (chartCanvas.height * pageWidth) / chartCanvas.width;
    doc.addImage(chartImgData, 'PNG', margin, yOffset, pageWidth, chartImgHeight);

    document.body.removeChild(canvas);

    doc.save('Student_Habit_Report.pdf');
  };

  return (
    <ReportContainer>
      {isAdmin && (
      <div>
        <label htmlFor="user-select">Select User:</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={handleUserChange}
        >
          {users.map((u) => (
            <option key={u.auth0Id} value={u.auth0Id}>
              {u.name || u.email}
            </option>
          ))}
        </select>
      </div>
    )}
      <FeedbackInput
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button onClick={() => setShowReport(true)}>Generate Report</Button>
      {showReport && (
        <ReportContent>
          <Title>VARPAKODIT Student Report</Title>
          <p><strong>Report Date:</strong> {reportDate}</p>

          <SectionTitle>Student Information</SectionTitle>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Age:</strong> {studentData.age}</p>
          <p><strong>Weight:</strong> {studentData.weight} kg</p>
          <p><strong>Height:</strong> {studentData.height} cm</p>
          <p><strong>Grade:</strong> {studentData.grade}</p>

          <SectionTitle>Habit Analysis</SectionTitle>
          {habitData.map((habit, index) => (
            <p key={index}><strong>{habit.title}:</strong> {habit.value}</p>
          ))}
          
          <SectionTitle>Additional Remarks</SectionTitle>
          <p>This section can include any additional comments or insights.</p>
          <SectionTitle>User Feedback</SectionTitle>
          <p>{feedback}</p>
          <Button onClick={generatePDF}>Download PDF</Button>
        </ReportContent>
      )}
    </ReportContainer>
  );
};

// Example usage
// const studentData = {
//   name: 'John Doe',
//   age: 15,
//   weight: 60,
//   height: 170,
//   grade: '10th Grade',
//   attendance: 95,
// };

// const habitData = [
//   { title: 'Sleep', value: 'Good' },
//   { title: 'Eating', value: 'Balanced diet' },
//   { title: 'Hobbies', value: 'Reading, Gaming' },
//   { title: 'School', value: 'Good performance' },
//   { title: 'Friends and Family', value: 'Good relationships' },
//   { title: 'General Mood', value: 'Positive' },
// ];

// const eventData = [
//   { date: '2024-07-01', name: 'Science Fair' },
//   { date: '2024-07-15', name: 'Basketball Tournament' },
//   { date: '2024-07-20', name: 'School Play' },
// ];

const reportDate = new Date().toLocaleDateString();

const App = () => (
  <div>
    <h1>Student Reports</h1>
    <Report reportDate={reportDate} />
  </div>
);

export default App;