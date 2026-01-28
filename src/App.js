import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import CropRecommendation from './Components/CropRecommendation'; 
import Weather from './Components/Weather';
import Soil from './Components/Soil';
import SeasonalPlanning from './Components/CropPlanning';
import Forecast from './Components/Forecast';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path = "/CropRecommendation" element={<CropRecommendation />} />
        <Route path = "/weather"  element = {<Weather/>} />
        <Route path = "/Soil" element = {<Soil/>}/>
        <Route path = "/SeasonalPlanning" element ={<SeasonalPlanning/>} />
        <Route path = "/Forecast" element = {<Forecast/>}/>

      </Routes>
    </div>
  );
}

export default App;
