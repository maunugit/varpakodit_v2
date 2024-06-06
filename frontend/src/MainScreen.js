// src/MainScreen.js
import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1>Welcome!</h1>
          <p>Select an option below to get started:</p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Button variant="primary" size="lg" onClick={() => navigate('/daily-data')}>
            Fill Daily Data
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="primary" size="lg" onClick={() => navigate('/chat')}>
            Talk to a Virtual Assistant
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="secondary" size="lg" disabled>
            Fill Monthly Questionnaire
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="secondary" size="lg" disabled>
            Make a Weekly Plan
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MainScreen;
