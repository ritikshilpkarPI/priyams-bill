import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import reportWebVitals from './reportWebVitals';
import { AppStateContextProvider } from './AppState/appState.context';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { router } from './routes/routes';
import { RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

if (root) {
  root.render(
      <Provider store={store}>
        <AppStateContextProvider>
          <React.StrictMode>
            <MantineProvider>
              <ModalsProvider>
                <RouterProvider router={router} />
              </ModalsProvider>
            </MantineProvider>
          </React.StrictMode>
        </AppStateContextProvider>
      </Provider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
