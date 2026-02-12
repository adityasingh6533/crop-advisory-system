import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import LanguageSelect from './Components/LanguageSelect';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import CropRecommendation from './Components/CropRecommendation';
import Weather from './Components/Weather';
import Soil from './Components/Soil';
import SeasonalPlanning from './Components/CropPlanning';
import Forecast from './Components/Forecast';
import FinalRecommendation from './Components/FinalRecommendation';
import DiseaseDetection from './Components/DiseaseDetection';

import './App.css';

function App() {
  const lang = localStorage.getItem("lang"); // 🔑 RULE

  return (
    <div className="App">
      <Routes>

        {/* 🔹 Entry Page */}
        <Route path="/" element={<LanguageSelect />} />

        {/* 🔹 Protected Pages */}
        <Route path="/home" element={lang ? <Home /> : <Navigate to="/" />} />

        <Route path="/signin" element={lang ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={lang ? <SignUp /> : <Navigate to="/" />} />

        <Route path="/dashboard" element={lang ? <Dashboard /> : <Navigate to="/" />} />

        <Route
          path="/croprecommendation"
          element={lang ? <CropRecommendation /> : <Navigate to="/" />}
        />

        <Route path="/weather" element={lang ? <Weather /> : <Navigate to="/" />} />

        <Route path="/soil" element={lang ? <Soil /> : <Navigate to="/" />} />

        <Route
          path="/seasonalplanning"
          element={lang ? <SeasonalPlanning /> : <Navigate to="/" />}
        />

        <Route path="/forecast" element={lang ? <Forecast /> : <Navigate to="/" />} />

        <Route
          path="/detect"
          element={lang ? <DiseaseDetection /> : <Navigate to="/" />}
        />

        <Route
          path="/recommendation"
          element={lang ? <FinalRecommendation /> : <Navigate to="/" />}
        />

      </Routes>
    </div>
  );
}

export default App;