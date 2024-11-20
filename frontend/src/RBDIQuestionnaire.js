import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import api from './api/axios';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
`;

const StyledForm = styled.form`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333333;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioLabel = styled.label`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const RadioInput = styled.input`
  margin-right: 10px;
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

const questions = [
  {
    id: 1,
    options: [
      { value: 0, text: "Mielialani on melko valoisa ja hyvä" },
      { value: 1, text: "En ole alakuloinen tai surullinen" },
      { value: 2, text: "Tunnen itseni alakuloiseksi ja surulliseksi" },
      { value: 3, text: "Olen alakuloinen jatkuvasti, enkä pääse siitä yli" },
      { value: 4, text: "Olen niin masentunut ja alavireinen, etten kestä enää" }
    ]
  },
  {
    id: 2,
    options: [
      { value: 0, text: "Suhtaudun tulevaisuuteen toiveikkaasti" },
      { value: 1, text: "En suhtaudu tulevaisuuteen toivottomasti" },
      { value: 2, text: "Tulevaisuus tuntuu minusta melko masentavalta" },
      { value: 3, text: "Minusta tuntuu, ettei minulla ole tulevaisuudelta mitään odotettavaa" },
      { value: 4, text: "Tulevaisuus tuntuu minusta toivottomalta. En jaksa uskoa, että asiat muuttuisivat parempaan päin" }
    ]
  },
  {
    id: 3,
    options: [
      { value: 0, text: "Olen elämässäni onnistunut huomattavan usein" },
      { value: 1, text: "En tunne epäonnistuneeni elämässä" },
      { value: 2, text: "Minusta tuntuu, että olen epäonnistunut pyrkimyksissäni tavallista useammin" },
      { value: 3, text: "Elämäni on tähän saakka ollut vain sarja epäonnistumisia" },
      { value: 4, text: "Tunnen epäonnistuneeni täydellisesti ihmisenä" }
    ]
  },
  {
    id: 4,
    options: [
      { value: 0, text: "Olen varsin tyytyväinen elämääni" },
      { value: 1, text: "En ole erityisen tyytyväinen" },
      { value: 2, text: "En nauti asioista samalla tavoin kuin ennen" },
      { value: 3, text: "Minusta tuntuu, etten saa enää tyydytystä juuri mistään" },
      { value: 4, text: "Olen täysin tyytymätön kaikkeen" }
    ]
  },
  {
    id: 5,
    options: [
      { value: 0, text: "Tunnen itseni melko hyväksi" },
      { value: 1, text: "En tunne itseäni huonoksi ja arvottomaksi" },
      { value: 2, text: "Tunnen itseni huonoksi ja arvottomaksi melko usein" },
      { value: 3, text: "Nykyään tunnen itseni arvottomaksi melkein aina" },
      { value: 4, text: "Olen kerta kaikkiaan huono ja arvoton" }
    ]
  },
  {
    id: 6,
    options: [
      { value: 0, text: "Olen tyytyväinen itseeni ja suorituksiini" },
      { value: 1, text: "En ole pettynyt itseni suhteen" },
      { value: 2, text: "Olen pettynyt itseni suhteen" },
      { value: 3, text: "Minua inhottaa itseni" },
      { value: 4, text: "Vihaan itseäni" }
    ]
  },
  {
    id: 7,
    options: [
      { value: 0, text: "Minulla ei ole koskaan ollut itsemurha-ajatuksia" },
      { value: 1, text: "En ajattele, enkä halua vahingoittaa itseäni" },
      { value: 2, text: "Minusta tuntuu, että olisi parempi, jos olisin kuollut" },
      { value: 3, text: "Minulla on tarkat suunnitelmat itsemurhasta" },
      { value: 4, text: "Tekisin itsemurhan, jos siihen olisi mahdollisuus" }
    ]
  },
  {
    id: 8,
    options: [
      { value: 0, text: "Pidän ihmisten tapaamisesta ja juttelemisesta" },
      { value: 1, text: "En ole menettänyt kiinnostusta muihin ihmisiin" },
      { value: 2, text: "Toiset ihmiset eivät enää kiinnosta minua niin paljon kuin ennen" },
      { value: 3, text: "Olen melkein menettänyt mielenkiintoni sekä tunteeni toisia ihmisiä kohtaan" },
      { value: 4, text: "Olen menettänyt mielenkiintoni muihin ihmisiin, enkä välitä heistä lainkaan" }
    ]
  },
  {
    id: 9,
    options: [
      { value: 0, text: "Erilaisten päätösten tekeminen on minulle helppoa" },
      { value: 1, text: "Pystyn tekemään päätöksiä samoin kuin ennenkin" },
      { value: 2, text: "Varmuuteni on vähentynyt, ja yritän lykätä päätöksen tekoa" },
      { value: 3, text: "Minulla on suuria vaikeuksia päätösten teossa" },
      { value: 4, text: "En pysty enää lainkaan tekemään ratkaisuja ja päätöksiä" }
    ]
  },
  {
    id: 10,
    options: [
      { value: 0, text: "Olen melko tyytyväinen ulkonäkööni ja olemukseeni" },
      { value: 1, text: "Ulkonäössäni ei ole minua haittaavia piirteitä" },
      { value: 2, text: "Olen huolissani siitä, että näytän epämiellyttävältä" },
      { value: 3, text: "Minusta tuntuu, että näytän rumalta" },
      { value: 4, text: "Olen varma, että näytän rumalta ja vastenmieliseltä" }
    ]
  },
  {
    id: 11,
    options: [
      { value: 0, text: "Minulla ei ole nukkumisessa minkäänlaisia vaikeuksia" },
      { value: 1, text: "Nukun yhtä hyvin kuin ennenkin" },
      { value: 2, text: "Herätessäni aamuisin olen paljon väsyneempi kuin ennen" },
      { value: 3, text: "Minua haittaa unettomuus" },
      { value: 4, text: "Kärsin unettomuudesta, nukahtamisvaikeuksista tai liian aikaisesta kesken unien heräämisestä" }
    ]
  },
  {
    id: 12,
    options: [
      { value: 0, text: "Väsyminen on minulle lähes täysin vierasta" },
      { value: 1, text: "En väsy helpommin kuin tavallisestikaan" },
      { value: 2, text: "Väsyn helpommin kuin ennen" },
      { value: 3, text: "Vähäinen työ väsyttää ja uuvuttaa minua" },
      { value: 4, text: "Olen liian väsynyt tehdäkseni mitään" }
    ]
  },
  {
    id: 13,
    options: [
      { value: 0, text: "Ruokahalussani ei ole mitään hankaluuksia" },
      { value: 1, text: "Ruokahaluni on ennallaan" },
      { value: 2, text: "Ruokahaluni on huonompi kuin ennen" },
      { value: 3, text: "Ruokahaluni on nyt paljon huonompi kuin ennen" },
      { value: 4, text: "Minulla ei ole enää lainkaan ruokahalua" }
    ]
  }
];

const RBDIQuestionnaire = () => {
  const { user } = useAuth0();
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
      await api.post('/api/rbdiQuestionnaire', {
        userId: user.sub,
        userName: user.name,
        answers,
        totalScore
      });
      alert('BDI questionnaire submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit R-BDI questionnaire');
    }
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <h2>R-BDI-kysely</h2>
        {questions.map((question) => (
          <FormGroup key={question.id}>
            <FormLabel>{question.id}.</FormLabel>
            <RadioGroup>
              {question.options.map((option) => (
                <RadioLabel key={option.value}>
                  <RadioInput
                    type="radio"
                    name={`question_${question.id}`}
                    value={option.value}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    required
                  />
                  {option.text}
                </RadioLabel>
              ))}
            </RadioGroup>
          </FormGroup>
        ))}
        <SubmitButton type="submit">Submit</SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default RBDIQuestionnaire;
