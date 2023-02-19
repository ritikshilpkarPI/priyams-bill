import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppStateContextProvider } from './AppState/appState.context';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

ReactDOM.render(
  <BrowserRouter>
    <AppStateContextProvider>
      <React.StrictMode>
        <MantineProvider>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </MantineProvider>
      </React.StrictMode>
    </AppStateContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
