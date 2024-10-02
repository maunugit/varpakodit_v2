// src/DailyDataForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
`;

const StyledForm = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333333;
`;

const FormControl = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  color: #495057;
  background-color: #ffffff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FormControlText = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  color: #495057;
  background-color: #ffffff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;


const DailyDataForm = () => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    sleep: '',
    eating: '',
    school: '',
    hobbies: '',
    friendsFamily: '',
    generalMood: '',
    outsideTime: '', 
    hygiene: '', 
    screenTime: '', 
    timeWithAdults: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if the field is sleep or screenTime, store it as a number
    const parsedValue = 
      name === 'sleep' || name === 'screenTime' ? Number(value) : value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      await axios.post('http://localhost:5000/api/dailyData', {
        userId: user.sub,
        ...formData,
      });
      alert('Data submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit data');
    }
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
      <FormGroup>
          <FormLabel>Sleep (1-5)</FormLabel>
          <FormControl
            as="select"
            name="sleep"
            value={formData.sleep}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">1 - Very Poor</option>
            <option value="2">2 - Poor</option>
            <option value="3">3 - Okay</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Eating</FormLabel>
          <FormControl name="eating" value={formData.eating} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>School</FormLabel>
          <FormControl name="school" value={formData.school} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Hobbies</FormLabel>
          <FormControl name="hobbies" value={formData.hobbies} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Friends and Family</FormLabel>
          <FormControl name="friendsFamily" value={formData.friendsFamily} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>General Mood</FormLabel>
          <FormControl name="generalMood" value={formData.generalMood} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        {/* Outside Time */}
        <FormGroup>
          <FormLabel>Outside Time</FormLabel>
          <FormControl name="outsideTime" value={formData.outsideTime} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Not at all">Not at all</option>
            <option value="less than an hour">Less than an hour</option>
            <option value="1-2 hours">1-2 hours</option>
            <option value="3+ hours">3+ hours</option>
          </FormControl>
        </FormGroup>

        {/* Hygiene */}
        <FormGroup>
          <FormLabel>Hygiene</FormLabel>
          <FormControl name="hygiene" value={formData.hygiene} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>

        {/* Screen Time */}
        <FormGroup>
          <FormLabel>Screen Time (hours)</FormLabel>
          <FormControlText
            type="number"
            name="screenTime"
            value={formData.screenTime}
            onChange={handleChange}
            placeholder="Enter hours"
            min="0"
            required
          />
        </FormGroup>

        {/* Time Spent with Grown Ups/Personnel */}
        <FormGroup>
          <FormLabel>Time Spent with Grown Ups/Personnel</FormLabel>
          <FormControl name="timeWithAdults" value={formData.timeWithAdults} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </FormControl>
        </FormGroup>
        <ButtonContainer>
          <SubmitButton type="submit">Submit</SubmitButton>
        </ButtonContainer>
      </StyledForm>
    </FormContainer>
  );
};

export default DailyDataForm;
