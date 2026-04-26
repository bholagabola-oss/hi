import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import Navbar from './components/Navbar';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />
            <Route path="/dashboard" element={<><Navbar /><DashboardPage /></>} />
            <Route path="/editor/:jobId?" element={<EditorPage />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            theme="dark"
            toastStyle={{ background: '#1a1a2e', border: '1px solid #00ff87' }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
