import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#F26D46',
    },
    secondary: {
      main: '#0a7cff',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
