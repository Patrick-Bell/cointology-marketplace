// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './components/Authenticate/AppContent'; // Import the new component

function App() {
    return (
        <Router>
            <AppContent /> {/* Render AppContent which handles routing and navbar logic */}
        </Router>
    );
}

export default App;
