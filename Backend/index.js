const express = require('express');
const currentWeather = require("./api/currentWeather");
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/user');
const userRouter = require('./api/user');
const CropInputRouter = require('./api/CropInput');
const recommendation = require('./api/recommendation.js')
require("dotenv").config();
const app= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:  false }));

app.use('/api/user', userRouter);
app.use('/api/cropInput', CropInputRouter);

app.use("/api/weather", currentWeather);
app.use("/api/recommendation", recommendation);

const PORT = process.env.PORT || 5002;

const {connectToMongoDB}=require('./connect');

connectToMongoDB("mongodb://127.0.0.1:27017/cropAdvisorySystem").then(()=>{
    console.log("Connected to MongoDB successfully");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



