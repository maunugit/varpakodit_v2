import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';
import styled from 'styled-components';

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

const Report = ({ studentData, habitData, eventData, reportDate }) => {
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState('');

  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let yOffset = 30;

    // Title and Date
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VARPAKODDIT Student Report', pageWidth / 2, yOffset, { align: 'center' });
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
    doc.text(`Attendance: ${studentData.attendance}%`, margin, yOffset);
    yOffset += 20;

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
    eventData.forEach((event) => {
      doc.text(`- ${event.date}: ${event.name}`, margin, yOffset);
      yOffset += 10;
    });
    yOffset += 20;

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
      <FeedbackInput
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button onClick={() => setShowReport(true)}>Generate Report</Button>
      {showReport && (
        <ReportContent>
          <Title>VARPAKODDIT Student Report</Title>
          <p><strong>Report Date:</strong> {reportDate}</p>
          <SectionTitle>Student Information</SectionTitle>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Age:</strong> {studentData.age}</p>
          <p><strong>Weight:</strong> {studentData.weight} kg</p>
          <p><strong>Height:</strong> {studentData.height} cm</p>
          <p><strong>Grade:</strong> {studentData.grade}</p>
          <p><strong>Attendance:</strong> {studentData.attendance}%</p>
          <SectionTitle>Habit Analysis</SectionTitle>
          {habitData.map((habit, index) => (
            <p key={index}><strong>{habit.title}:</strong> {habit.value}</p>
          ))}
          <SectionTitle>Events Attended</SectionTitle>
          {eventData.map((event, index) => (
            <p key={index}><strong>{event.date}:</strong> {event.name}</p>
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
const studentData = {
  name: 'John Doe',
  age: 15,
  weight: 60,
  height: 170,
  grade: '10th Grade',
  attendance: 95,
};

const habitData = [
  { title: 'Sleep', value: '7 hours' },
  { title: 'Eating', value: 'Balanced diet' },
  { title: 'Hobbies', value: 'Reading, Gaming' },
  { title: 'School', value: 'Good performance' },
  { title: 'Sports', value: 'Soccer' },
  { title: 'Friends and Family', value: 'Good relationships' },
  { title: 'General Mood', value: 'Positive' },
];

const eventData = [
  { date: '2024-07-01', name: 'Science Fair' },
  { date: '2024-07-15', name: 'Basketball Tournament' },
  { date: '2024-07-20', name: 'School Play' },
];

const reportDate = new Date().toLocaleDateString();

const App = () => (
  <div>
    <h1>Student Reports</h1>
    <Report studentData={studentData} habitData={habitData} eventData={eventData} reportDate={reportDate} />
  </div>
);

export default App;
