// src/components/Settings.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'fi');

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('settings')}
      </Typography>
      <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
        <FormLabel component="legend">{t('select_language')}</FormLabel>
        <RadioGroup
          aria-label="language"
          name="language"
          value={language}
          onChange={handleLanguageChange}
        >
          <FormControlLabel value="en" control={<Radio />} label={t('english')} />
          <FormControlLabel value="fi" control={<Radio />} label={t('finnish')} />
        </RadioGroup>
      </FormControl>
    </Container>
  );
};

export default Settings;
