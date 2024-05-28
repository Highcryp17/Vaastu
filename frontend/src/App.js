import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import MintToken from './components/MintToken';

const App = () => {
  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/mint-token" element={<MintToken />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
