// src/components/QuestionnaireSelection.js
import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const SelectionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const QuestionnaireCard = styled.div`
  width: 300px;
  height: 200px;
  margin: 20px;
  background-color: #6200ee;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #3700b3;
  }
`;

const QuestionnaireSelection = () => {
  const history = useHistory();

  const handleBDIClick = () => {
    history.push('/bdi-questionnaire');
  };

  const handleRBDIClick = () => {
    history.push('/r-bdi-questionnaire');
  };

  return (
    <SelectionContainer>
      <QuestionnaireCard onClick={handleBDIClick}>
        BDI-mielialakysely
      </QuestionnaireCard>
      <QuestionnaireCard onClick={handleRBDIClick}>
        R-BDI (Nuorten mielialakysely)
      </QuestionnaireCard>
    </SelectionContainer>
  );
};

export default QuestionnaireSelection;
