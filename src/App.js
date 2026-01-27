import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import CropRecommendation from './Components/CropRecommendation'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path = "/CropRecommendation" element={<CropRecommendation />} />
      </Routes>
    </div>
  );
}

export default App;
