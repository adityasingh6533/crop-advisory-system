import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LanguageSelect from './pages/LanguageSelect';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import Weather from './pages/Weather';
import Forecast from './pages/Forecast';
import FinalRecommendation from './pages/FinalRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import ProtectedRoute from './Routes/ProtectedRoute';
import { UserProvider } from './contextProvider/context';
import './App.css';

function App() {
  const lang = localStorage.getItem("lang"); 

  return (
    <div className="App">
      <UserProvider>
      <Routes>

        {}
        <Route path="/" element={<LanguageSelect />} />

        {}
        <Route path="/home" element={lang ? <Home /> : <Navigate to="/" />} />

        <Route path="/signin" element={lang ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={lang ? <SignUp /> : <Navigate to="/" />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route
          path="/croprecommendation"
          element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>}
        />

        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />

        <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />

        <Route
          path="/detect"
          element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>}
        />

        <Route
          path="/recommendation"
          element={<ProtectedRoute><FinalRecommendation /></ProtectedRoute>}
        />

      </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
