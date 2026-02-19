---

## 🌾 Crop Recommendation & Sowing Advisory (Rule-Based Agronomy Engine)

Along with disease detection, the system provides intelligent crop sowing advice based on environmental conditions.

This module does not rely on machine learning.  
Instead, it uses **agronomic rules derived from agricultural practices** to produce reliable recommendations.

---

### Inputs Used

The advisory considers multiple real-world farming parameters:

- Season (Kharif / Rabi / Zaid)
- Soil Type
- Irrigation Type (Rainfed / Irrigated)
- 14-Day Weather Forecast
  - Average Temperature
  - Rainfall Amount
  - Hot Days / Cold Days
  - Rain Distribution

---

### Decision Logic

The system evaluates whether sowing is safe or risky using threshold-based agricultural rules.

Examples:

- Extreme temperature → delay sowing
- Low rainfall + rainfed farming → high risk
- Continuous hot days → heat stress advisory
- Suitable soil moisture → sow now

---

### Output

The module produces a structured advisory instead of a simple yes/no:

- Sowing Decision (Sow Now / Delay Sowing)
- Risk Level (Low / Moderate / High)
- Recommended Crop Category
- Action Plan (what farmer should do next)
- Reasons behind the decision

---

### Why Rule-Based Instead of ML?

Agriculture decisions depend on well-established domain knowledge.  
Using deterministic agronomic rules ensures:

- Stability across regions
- Explainable output
- No dependency on large historical datasets
- Consistent behavior in real-world conditions

This makes the system more trustworthy for farmers.

Download Model Link - https://drive.google.com/file/d/1EUVq695L63d1wbecpNyHkgBZwsEVTlkd/view?usp=sharing 
---

### Role in Overall System

The project combines three layers:

1. Weather Analysis → checks environmental suitability
2. Crop Advisory Engine → decides sowing strategy
3. AI Disease Detection → monitors crop health

Together they form a **complete crop decision support platform**.

---
