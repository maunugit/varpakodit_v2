import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
      { value: 0, text: "En ole surullinen" },
      { value: 1, text: "Olen alakuloinen ja surullinen" },
      { value: 2, text: "Olen tuskastumiseen asti surullinen ja alakuloinen" },
      { value: 3, text: "Olen niin onneton, etten enää kestä" }
    ]
  },
  {
    id: 2,
    options: [
      { value: 0, text: "Tulevaisuus ei masenna eikä pelota minua " },
      { value: 1, text: "Tulevaisuus pelottaa minua " },
      { value: 2, text: "Minusta tuntuu, ettei tulevaisuudella ole tarjottavanaan minulle juuri mitään " },
      { value: 3, text: "Minusta tuntuu, että tulevaisuus on toivoton. En jaksa uskoa, että asiat muuttuvat tästä parempaan päin" }
    ]
  },
  {
    id: 3,
    options: [
      { value: 0, text: "En tunne epäonnistuneeni " },
      { value: 1, text: "Minusta tuntuu, että olen epäonnistunut useammin kuin muut ihmiset " },
      { value: 2, text: "Elämäni on tähän saakka ollut vain sarja epäonnistumisia " },
      { value: 3, text: "Minusta tuntuu, että olen täysin epäonnistunut ihmisenä " }
    ]
  },
  {
    id: 4,
    options: [
      { value: 0, text: "En ole erityisen haluton" },
      { value: 1, text: "En osaa nauttia asioista niin kuin ennen " },
      { value: 2, text: "Minusta tuntuu, etten saa tyydytystä juuri mistään" },
      { value: 3, text: "Olen haluton ja tyytymätön kaikkeen" }
    ]
  },
  {
    id: 5,
    options: [
      { value: 0, text: "En tunne erityisemmin syyllisyyttä" },
      { value: 1, text: "Minusta tuntuu, että olen aika huono ja kelvoton" },
      { value: 2, text: "Nykyään tunnen itseni huonoksi ja kelvottomaksi melkein aina" },
      { value: 3, text: "Tunnen olevani erittäin huono ja arvoton" }
    ]
  },
  {
    id: 6,
    options: [
      { value: 0, text: "En koe, että minua rangaistaan" },
      { value: 1, text: "Tunnen, että jotain pahaa voi sattua minulle" },
      { value: 2, text: "Uskon, että kohtalo rankaisee minua" },
      { value: 3, text: "Tunnen, että olen tehnyt sellaista, josta minua on syytäkin rangaista" }
    ]
  },
  {
    id: 7,
    options: [
      { value: 0, text: "En ole pettynyt itseeni" },
      { value: 1, text: "Olen pettynyt itseeni " },
      { value: 2, text: "Inhoan itseäni" },
      { value: 3, text: "Vihaan itseäni" }
    ]
  },
  {
    id: 8,
    options: [
      { value: 0, text: "Tunnen, että olen yhtä hyvä kuin muutkin" },
      { value: 1, text: "Kritisoin itseäni heikkouksista" },
      { value: 2, text: "Moitin itseäni virheistäni " },
      { value: 3, text: "Moitin itseäni kaikesta, mikä 'menee pieleen'" }
    ]
  },
  {
    id: 9,
    options: [
      { value: 0, text: "En ole ajatellut vahingoittaa itseäni" },
      { value: 1, text: "Olen joskus ajatellut itseni vahingoittamista, mutten kuitenkaan tee niin " },
      { value: 2, text: "Mielessäni on selvät itsemurhasuunnitelmat " },
      { value: 3, text: "Tapan itseni, kun siihen tulee tilaisuus" }
    ]
  },
  {
    id: 10,
    options: [
      { value: 0, text: "En itke tavallista enempää" },
      { value: 1, text: "Itken nykyään aiempaa enemmän" },
      { value: 2, text: "Itken nykyään jatkuvasti" },
      { value: 3, text: "En kykene enää itkemään, vaikka haluaisin" }
    ]
  },
  {
    id: 11,
    options: [
      { value: 0, text: "En ole sen ärtyneempi kuin ennenkään" },
      { value: 1, text: "Ärsyynnyn aiempaa herkemmin" },
      { value: 2, text: "Tunnen, että olen ärtynyt koko ajan" },
      { value: 3, text: "Minua eivät enää liikuta asiat, joista aiemmin raivostuin" }
    ]
  },
  {
    id: 12,
    options: [
      { value: 0, text: "Olen edelleen kiinnostunut muista ihmisistä" },
      { value: 1, text: "Muut kiinnostavat minua aiempaa vähemmän " },
      { value: 2, text: "Kiinnostukseni ja tunteeni muita kohtaan ovat miltei kadonneet " },
      { value: 3, text: "Olen menettänyt kaiken mielenkiintoni muita kohtaan, enkä välitä heistä enää lainkaan" }
    ]
  },
  {
    id: 13,
    options: [
      { value: 0, text: "Pystyn tekemään päätöksiä, kuten ennenkin" },
      { value: 1, text: "Yritän lykätä päätöksentekoa" },
      { value: 2, text: "Minun on hyvin vaikeata tehdä päätöksiä" },
      { value: 3, text: "En pysty enää lainkaan tekemään päätöksiä" }
    ]
  },
  {
    id: 14,
    options: [
      { value: 0, text: "Mielestäni ulkonäköni ei ole muuttunut" },
      { value: 1, text: "Olen huolissani siitä, että näytän vanhalta tai etten näytä miellyttävältä" },
      { value: 2, text: "Minusta tuntuu, että ulkonäköni on muuttunut pysyvästi niin, etten näytä miellyttävältä " },
      { value: 3, text: "Tunnen olevani ruma ja vastenmielisen näköinen" }
    ]
  },
  {
    id: 15,
    options: [
      { value: 0, text: "Työkykyni on säilynyt ennallaan" },
      { value: 1, text: "Työn aloittaminen vaatii minulta ylimääräisiä ponnistuksia " },
      { value: 2, text: "Saadakseni aikaan jotakin minun on suorastaan pakotettava itseni siihen " },
      { value: 3, text: "En kykene lainkaan tekemään työtä" }
    ]
  },
  {
    id: 16,
    options: [
      { value: 0, text: "Nukun yhtä hyvin kuin ennen" },
      { value: 1, text: "Olen aamuisin väsyneempi kuin ennen " },
      { value: 2, text: "Herään nykyisin 1-2 tuntia normaalia aikaisemmin enkä nukahda enää uudelleen " },
      { value: 3, text: "Herään aikaisin joka aamu, enkä pysty nukkumaan viittä tuntia pitempään yhtäjaksoisesti " }
    ]
  },
  {
    id: 17,
    options: [
      { value: 0, text: "En väsy sen nopeammin kuin ennen" },
      { value: 1, text: "Väsyn nopeammin kuin ennen " },
      { value: 2, text: "Väsyn lähes tyhjästä" },
      { value: 3, text: "Olen liian väsynyt tehdäkseni mitään" }
    ]
  },
  {
    id: 18,
    options: [
      { value: 0, text: "Ruokahaluni on ennallaan" },
      { value: 1, text: "Ruokahaluni on huonompi kuin ennen" },
      { value: 2, text: "Ruokahaluni on nyt paljon huonompi kuin ennen" },
      { value: 3, text: "Minulla ei ole lainkaan ruokahalua" }
    ]
  },
  {
    id: 19,
    options: [
      { value: 0, text: "Painoni on pysynyt viime aikoina ennallaan" },
      { value: 1, text: "Olen laihtunut yli 2,5 kg" },
      { value: 2, text: "Olen laihtunut yli 5 kg" },
      { value: 3, text: "Olen laihtunut yli 7,5 kg" }
    ]
  },
  {
    id: 20,
    options: [
      { value: 0, text: "En ajattele terveyttäni tavallista enempää" },
      { value: 1, text: "Kiinnitän tavallista enemmän huomiota särkyihin ja kipuihin, vatsavaivoihin ja ummetukseen " },
      { value: 2, text: "Tarkkailen ruumiintuntemuksiani niin paljon, ettei muille ajatuksille jää aikaa " },
      { value: 3, text: "Terveyteni ja tuntemusteni ajatteleminen on kokonaan vallannut mieleni " }
    ]
  },
  {
    id: 21,
    options: [
      { value: 0, text: "Kiinnostukseni sukupuolielämään on pysynyt ennallaan" },
      { value: 1, text: "Kiinnostukseni sukupuolielämään on vähentynyt " },
      { value: 2, text: "Kiinnostukseni sukupuolielämään on huomattavasti vähäisempää kuin aikaisemmin " },
      { value: 3, text: "Olen menettänyt kaiken mielenkiintoni sukupuolielämään " }
    ]
  },
  
];

const BDIQuestionnaire = () => {
  const { t } = useTranslation();
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
      await axios.post('http://localhost:5000/api/bdiQuestionnaire', {
        userId: user.sub,
        userName: user.name,
        answers,
        totalScore
      });
      alert('BDI questionnaire submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit BDI questionnaire');
    }
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
      <h2>{t('bdi_questionnaire')}</h2>
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

export default BDIQuestionnaire;