// // src/main.jsx (Verification)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Must be imported
import App from './App.jsx';
import './index.css';
import { AppContextProvider } from './Context/AppContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* THIS WRAPPER IS MANDATORY FOR <Routes> TO WORK */}
    <BrowserRouter> 
    <AppContextProvider>
      <App />
    </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

