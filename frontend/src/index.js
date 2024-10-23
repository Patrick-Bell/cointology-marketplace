import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './components/context/CartContext';
import { FavouriteProvider } from './components/context/FavouriteContext';
import { AuthenticateProvider } from './components/context/AuthenticateContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { PaginationProvider } from './components/context/PaginationContext';

const theme = createTheme({
  palette: {
      primary: {
          main: purple[500],  // Use purple as the primary color
      },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <PaginationProvider>
    <AuthenticateProvider>
    <FavouriteProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </FavouriteProvider>
    </AuthenticateProvider>
    </PaginationProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
