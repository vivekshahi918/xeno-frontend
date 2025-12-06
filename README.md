# Xeno Insights Dashboard (Frontend)

## 🚀 Project Overview
The Xeno Insights Dashboard is a modern, responsive React application that visualizes data ingested from Shopify. It provides real-time business intelligence including revenue trends, customer acquisition, and inventory status.

## 🎨 Features
- **📊 Interactive Analytics:** Composed charts (Revenue vs Targets) and Donut charts using Recharts.
- **🔄 Real-time Sync:** "Sync Data" button triggers the backend ingestion process.
- **📱 Responsive Design:** Built with Tailwind CSS for a seamless mobile and desktop experience.
- **📂 Modular Views:** Tabs for Overview, Customers, Products, and Advanced Analytics.

## 🛠 Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## ⚙️ Setup Instructions

### 1. Installation
```bash
git clone <your-frontend-repo-url>
cd xeno-frontend

# Install dependencies
npm install
```

### 2. Configuration
(Optional) Create a .env file if connecting to a deployed backend:
```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
```
#### By default, it connects to http://localhost:4000/api.

### 3. Run the Application
```bash
npm run dev
```
#### Open your browser to http://localhost:5173.

## 📸 Usage

* **Login**: Click "Enter Dashboard" (Mock authentication).
* **View Stats**: See live data pulled from the PostgreSQL database.
* **Sync**: Click the "Sync Data" button in the top right to fetch the latest orders from Shopify.
* **Analyze**: Navigate to the "Analytics" tab to view advanced composed charts.