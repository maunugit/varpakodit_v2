// src/DailyDataForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import api from './api/axios';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; // Changed from center
  min-height: 100vh; // Changed from height: 100vh
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
  padding: 2rem 1rem; // Add some padding
  overflow-y: auto; // Enable scrolling if needed
`;

const StyledForm = styled.form`
  background-color: #ffffff;
  padding: 2rem; // Changed from 40px to be responsive
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 1rem auto; // Add margin to ensure spacing
`;

const FormGroup = styled.div`
  margin-bottom: 1rem; // Changed from 20px to be responsive
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333333;
`;

const FormControl = styled.select`
  width: 100%;
  padding: 0.75rem; // Changed from 12px to be responsive
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem; // Changed from 16px to be responsive
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
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
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
  margin-top: 1rem; // Changed from 20px
`;


const SubmitButton = styled.button`
  padding: 0.75rem 1.25rem; // Changed from px values
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;


const DailyDataForm = () => {
  const { t } = useTranslation();
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
      await api.post('/api/dailyData', {
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
          <FormLabel>{t('sleep')}</FormLabel>
          <FormControl
            as="select"
            name="sleep"
            value={formData.sleep}
            onChange={handleChange}
            required
          >
            <option value="">{t('select')}</option>
            <option value="1">{t('sleep_very_poor')}</option>
            <option value="2">{t('sleep_poor')}</option>
            <option value="3">{t('sleep_okay')}</option>
            <option value="4">{t('sleep_good')}</option>
            <option value="5">{t('sleep_excellent')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('eating')}</FormLabel>
          <FormControl name="eating" value={formData.eating} onChange={handleChange}>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        
        <FormGroup>
          <FormLabel>{t('school')}</FormLabel>
          <FormControl name="school" value={formData.school} onChange={handleChange}>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('hobbies')}</FormLabel>
          <FormControl name="hobbies" value={formData.hobbies} onChange={handleChange}>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('friends_and_family')}</FormLabel>
          <FormControl name="friendsFamily" value={formData.friendsFamily} onChange={handleChange}>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('general_mood')}</FormLabel>
          <FormControl name="generalMood" value={formData.generalMood} onChange={handleChange}>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('outside_time')}</FormLabel>
          <FormControl name="outsideTime" value={formData.outsideTime} onChange={handleChange} required>
            <option value="">{t('select')}</option>
            <option value="Not at all">Not at all</option>
            <option value="less than an hour">Less than an hour</option>
            <option value="1-2 hours">1-2 hours</option>
            <option value="3+ hours">3+ hours</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('hygiene')}</FormLabel>
          <FormControl name="hygiene" value={formData.hygiene} onChange={handleChange} required>
          <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('screen_time')}</FormLabel>
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
        <FormGroup>
          <FormLabel>{t('time_with_grownups')}</FormLabel>
          <FormControl name="timeWithAdults" value={formData.timeWithAdults} onChange={handleChange} required>
            <option value="">{t('select')}</option>
            <option value="bad">{t('bad')}</option>
            <option value="okay">{t('okay')}</option>
            <option value="good">{t('good')}</option>
          </FormControl>
        </FormGroup>
        <ButtonContainer>
          <SubmitButton type="submit">{t('submit')}</SubmitButton>
        </ButtonContainer>
      </StyledForm>
    </FormContainer>
  );
};

export default DailyDataForm;
