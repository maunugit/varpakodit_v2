// src/components/DailyDataForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

const DailyDataForm = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sleep: '',
    eating: '',
    hobbies: '',
    school: '',
    sports: '',
    friendsFamily: '',
    generalMood: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="sleep">
          <Form.Label>Sleep</Form.Label>
          <Form.Control as="select" name="sleep" value={formData.sleep} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="eating">
          <Form.Label>Eating</Form.Label>
          <Form.Control as="select" name="eating" value={formData.eating} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="hobbies">
          <Form.Label>Hobbies</Form.Label>
          <Form.Control type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
        </Form.Group>
        <br />
        <Form.Group controlId="school">
          <Form.Label>School</Form.Label>
          <Form.Control as="select" name="school" value={formData.school} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="sports">
          <Form.Label>Sports</Form.Label>
          <Form.Control as="select" name="sports" value={formData.sports} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="friendsFamily">
          <Form.Label>Friends and Family</Form.Label>
          <Form.Control as="select" name="friendsFamily" value={formData.friendsFamily} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Form.Group controlId="generalMood">
          <Form.Label>General Mood</Form.Label>
          <Form.Control as="select" name="generalMood" value={formData.generalMood} onChange={handleChange}>
            <option value="">Select</option>
            <option value="bad">Bad</option>
            <option value="okay">Okay</option>
            <option value="good">Good</option>
          </Form.Control>
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">Submit</Button>
        <Button variant="secondary" className="ml-3" onClick={() => navigate('/')}>Back to Main Menu</Button>
      </Form>
    </Container>
  );
};

export default DailyDataForm;
