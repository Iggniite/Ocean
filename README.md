# OceanEye 🌊👁️
**Real-Time Ocean Health Monitoring & Decision Support System**

## 📖 Overview
**Ocean ecosystems face escalating threats from industrial oil spills, plastic pollution, and chemical pH imbalances.** Existing monitoring tools lack real-time risk quantification and actionable alerts. 
**OceanEye** bridges this gap by providing an automated, data-driven platform to detect, score, and visualize ocean health risks across global maritime zones in real time.

Whether you're a marine biologist aiming to deploy cleanup crews, an operations agent dispatching local boats, or an environmental enthusiast tracking the health of the Great Barrier Reef, OceanEye translates complex environmental data into clear, actionable, and visual insights.

---

## ✨ Core Features
- **Real-Time Data Simulation:** Continuously polls 6 simulated global ocean zones every 5 seconds, accurately modeling natural environmental drift and unpredictable spike events mathematically bounded to real-world limits.
- **Weighted Risk Engine:** Utilizes an FMEA-style (Failure Mode and Effects Analysis) calculation to weigh pH (30%), Oil (40%), and Plastic (30%) density into a normalized `0-100` Danger Score.
- **Smart Alert System:** Automatically isolates analytical data to output actionable recommendations and root-cause identifications (e.g., *"Deploy oil spill response team and contain area"*).
- **Interactive Mapping:** Color-coded Leaflet GPS markers provide immediate visual threat recognition precisely located across the globe.
- **Advanced Smoothing Analytics:** Toggle between Raw Data and a 5-Tick Moving Average to forcefully filter out momentary noise and clearly track increasing or decreasing trend lines.
- **Cross-Sectional History & Exports:** Visually inspect strictly what percentage of risk each contaminant contributes to zones, and easily export the table data to `CSV` for broad external analysis.

---

## 💻 Tech Stack & Architecture
OceanEye is constructed as a robust, decoupled Full-Stack web application explicitly designed emphasizing clear separation of concerns.

### Frontend
- **Client Framework:** React 18 + Vite (Lighting fast builds)
- **Styling UI:** Tailwind CSS v3 (Custom Dark-mode Glassmorphism UI)
- **Data Visualization Analytics:** Recharts (Dynamic Area/Pie Charts)
- **Geolocation Mapping:** Leaflet.js + React-Leaflet overlaying OpenStreetMap 
- **State Controller:** React Context API (with synchronized real-time `setInterval` polling)

### Backend
- **Runtime Environment:** Node.js
- **API Framework:** Express.js REST 
- **Database Architecture:** MongoDB Object Modeling (via Mongoose schemas & `mongodb-memory-server` allowing strictly zero-setup local execution)
- **Data Engine:** Custom constraint-bounded simulation algorithm generating continuous varied inputs organically.

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended) installed on your machine.
- No difficult database configuration is required! The backend specifically establishes an isolated in-memory MongoDB instance which automatically creates, handles, and wipes data execution seamlessly upon exit.

### 1. Start the Backend Simulation Server 
Open your terminal and navigate to the backend API directory:
```bash
cd ocean-eye/server
npm install
npm start
```
*The server will boot up on `http://localhost:5000` and automatically begin seeding baseline data.*

### 2. Start the Frontend Dashboard
Open a **new** terminal window and navigate to the interactive client library:
```bash
cd ocean-eye/client
npm install
npm run dev
```
*Vite will compile and map the frontend to `http://localhost:5173`. Open this URL in your browser to command the live dashboard!*

---

## 📊 Analytics & Classification
- **0–33 (Safe - Green):** Normal ecological limits cleanly intact. Regular baseline monitoring continues.
- **34–66 (Moderate - Yellow):** Parameters steadily shifting beyond the baseline. Sampling frequency is intelligently increased across the alerted zone.
- **67–100 (Dangerous - Red):** Critical contamination thresholds distinctly breached. Aggressive emergency response strategies are immediately recommended via the Live Alert Stream.
