import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from 'src/core/MuiThemeProvider';
import { StoreProvider } from 'src/core/StoreProvier';
import { Routes } from 'src/components/Routes';

const App = () => (
  <BrowserRouter>
    <StoreProvider>
      <MuiThemeProvider>
        <Routes />
      </MuiThemeProvider>
    </StoreProvider>
  </BrowserRouter>
);

export default App;
