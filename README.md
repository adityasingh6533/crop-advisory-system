<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/2c3f61bc-cd4d-4008-93ef-911be251bb93" />
<img width="1919" height="902" alt="image" src="https://github.com/user-attachments/assets/a5c13acc-9bd9-4a88-883c-a5f492594c26" />






# Hybrid Crop Advisory System with AI-based Disease Detection

This project is a full-stack crop support platform that brings together:

- Rule-based crop sowing advisory
- Weather and forecast-based decision support
- AI-based disease detection
- User authentication
- NDVI-based field monitoring with Sentinel Hub

The goal is to help farmers and users make better crop decisions using weather conditions, field health insights, and image-based disease checks in one place.

---

## Crop Advisory Module

The crop advisory module does not rely on machine learning.  
Instead, it uses agronomic rules derived from practical agricultural conditions to generate recommendations.

### Inputs Used

The advisory flow considers real farming parameters such as:

- Season (`Kharif`, `Rabi`, `Zaid`)
- Soil type
- Irrigation type (`Rainfed` / `Irrigated`)
- Weather conditions
- Forecast-driven suitability signals

### Decision Logic

The system checks whether sowing is safe, risky, or should be delayed using threshold-based agricultural rules.

Examples of advisory logic:

- Extreme temperature can delay sowing
- Low rainfall with rainfed farming increases risk
- Continuous hot conditions can trigger heat-stress warnings
- Better moisture and weather suitability can support sow-now guidance

### Output

The module produces structured results instead of a basic yes/no response:

- Sowing decision
- Risk level
- Crop recommendation or suitability guidance
- Action plan
- Reasoning behind the recommendation

### Why Rule-Based Instead of ML?

Agriculture decisions often depend on established domain knowledge.  
Using deterministic agronomic rules helps keep the advisory:

- Explainable
- Stable
- Consistent
- Less dependent on large historical training datasets

This makes the output easier to understand and trust.

---

## AI Disease Detection

The project also includes an AI-based disease detection flow for crop images.

This part of the system is used to:

- Upload crop images
- Run disease detection
- Help users identify plant health issues more quickly

### Disease Detection Model Link

`https://drive.google.com/file/d/1EUVq695L63d1wbecpNyHkgBZwsEVTlkd/view?usp=sharing`

---

## NDVI Monitoring

The project includes an NDVI monitoring feature powered by Sentinel Hub for satellite-based field health analysis.

### Implemented NDVI Features

- Protected NDVI pages in the frontend
- NDVI image generation for selected field bounds
- NDVI statistics for selected field geometry
- Health summary from NDVI values
- Field insights such as:
  - coverage percentage
  - uniformity score
  - weak and critical area estimates
  - urgency level
- Save field boundaries for authenticated users
- Save NDVI scan history
- View saved fields and field history

### NDVI Backend Route

The backend exposes NDVI APIs under:

- `/api/ndvi`

### Sentinel Hub Usage

The backend uses Sentinel Hub for:

- access token generation
- NDVI image processing
- NDVI statistics aggregation

---

## Authentication and User Flow

The application includes authentication features for protected access to user-specific tools.

Implemented authentication features:

- Sign up
- Sign in
- JWT-based authentication
- Protected routes for dashboard and NDVI features
- User profile access through backend auth middleware

---

## Main Frontend Routes

The project currently includes these main frontend flows:

- Language selection
- Home page
- Sign in / Sign up
- Dashboard
- Crop recommendation
- Weather
- Forecast
- Final recommendation
- Disease detection
- NDVI
- NDVI map

---

## Backend API Areas

The backend currently serves routes for:

- `/api/user`
- `/api/cropInput`
- `/api/weather`
- `/api/recommendation`
- `/api/ndvi`

---

## Tech Stack

- React
- React Router
- Node.js
- Express
- MongoDB
- JWT authentication
- Sentinel Hub APIs

---

## Environment Variables

### Frontend

```env
REACT_APP_API_BASE_URL=https://your-backend-service.onrender.com
REACT_APP_ML_API_URL=https://your-ml-service.onrender.com
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

### Backend

```env
PORT=5002
MONGODB_URI=your-mongodb-uri
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
WEATHER_API_KEY=your-weather-api-key
CLIENT_ID=your-sentinel-client-id
CLIENT_SECRET=your-sentinel-client-secret
```

The NDVI service also supports these alternative Sentinel variable names:

```env
SENTINEL_CLIENT_ID=your-sentinel-client-id
SENTINEL_CLIENT_SECRET=your-sentinel-client-secret
```

---

## Role in the Overall System

The project combines multiple support layers:

1. Weather analysis for environmental awareness
2. Crop advisory for sowing decisions
3. Disease detection for crop health checks
4. NDVI-based monitoring for satellite field analysis

Together, these features form a more complete crop decision support platform.
