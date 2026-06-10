# MagicProperty Elite - Indian Property Search App

MagicProperty Elite is a full-stack web application designed for browsing and filtering residential property listings in major Indian cities. The application provides an elegant, modern, and responsive interface to search, filter, and view premium flats, villas, and independent houses for rent or purchase.

---

## 🏗️ Architecture & Tech Stack

The project is structured as a decoupled monorepo containing a Python-based FastAPI backend and a React-based Vite frontend.

### Backend ([backend](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/backend))
*   **Web Framework**: FastAPI (high performance, automatic Swagger/OpenAPI documentation generation).
*   **Database ORM**: SQLAlchemy with SQLite for local, zero-config relational storage.
*   **Data Validation**: Pydantic for request and response serialization schema checking.
*   **Auto-Seeding**: Upon startup, if the database is empty, it automatically seeds 80 mock Indian real estate properties across 4 cities.

### Frontend ([frontend](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/frontend))
*   **Core**: React (v19) configured via Vite for hot-module replacement (HMR).
*   **Styling**: Tailwind CSS (utility-first styling framework) for sleek, responsive, and glassmorphic designs.
*   **Icons**: Lucide React for consistent and crisp vector iconography.
*   **State Management**: React state handles filtering parameters and UI controls dynamically.

---

## 📁 Repository Structure

```text
property-search-app/
├── backend/
│   ├── main.py            # FastAPI entrypoint, routing, and CORS middleware
│   ├── database.py        # SQLite database setup and auto-seeding script
│   ├── models.py          # SQLAlchemy ORM declarations for Property model
│   ├── schemas.py         # Pydantic schemas for request validation & serialization
│   ├── requirements.txt   # Python dependency list
│   └── properties.db      # SQLite database file (created on runtime)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with city toggle (Bangalore / Mumbai)
│   │   │   ├── FilterBar.jsx     # Filtering controls (Buy/Rent, Property Type, BHK, Price)
│   │   │   ├── PropertyCard.jsx  # Reusable property snippet card
│   │   │   └── PropertyModal.jsx # Detail modal view with agent contact details
│   │   ├── App.jsx        # Core application wrapper, state, and fetch handlers
│   │   ├── index.css      # Core styles & Tailwind CSS directives
│   │   └── main.jsx       # React DOM bootstrapping
│   ├── package.json       # Node dependency list and command scripts
│   └── vite.config.js     # Vite builder setup
└── README.md              # Project documentation (this file)
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Python 3.8+](https://www.python.org/)
*   [Node.js (v18+)](https://nodejs.org/) & `npm`

---

### 1. Backend Setup

Navigate to the [backend](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/backend) directory:

```bash
cd backend
```

Create a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```
*   The backend will start at `http://localhost:8000`.
*   Swagger documentation is automatically generated and accessible at `http://localhost:8000/docs`.
*   On first run, the SQLite database is automatically created and seeded with 80 sample properties across Bangalore, Mumbai, Chennai, and Hyderabad.

---

### 2. Frontend Setup

Navigate to the [frontend](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/frontend) directory:

```bash
cd frontend
```

Install npm packages:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*   The web application will open on a local port (usually `http://localhost:5173`).
*   Ensure that the backend server is running on `http://localhost:8000` so that properties can load successfully.

---

## 🔌 API Endpoints

All API endpoints are defined in [main.py](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/backend/main.py).

### 1. Get Properties
*   **URL**: `/api/properties`
*   **Method**: `GET`
*   Parameters:
    *   `city` (string, optional): Filter by city name (e.g., `"Bangalore"`, `"Mumbai"`, `"Chennai"`, `"Hyderabad"`)
    *   `type` (string, optional): Filter by list type (`"buy"`, `"rent"`)
    *   `property_type` (string, optional): Filter by housing type (`"flat"`, `"house"`)
    *   `min_price` (integer, optional): Minimum budget limit in INR
    *   `max_price` (integer, optional): Maximum budget limit in INR
    *   `bhk` (integer, optional): Bedrooms count (e.g., `1`, `2`, `3`, `4`)
    *   `search` (string, optional): Free text search matching title, locality, descriptions, or amenities.

### 2. Get Property Details
*   **URL**: `/api/properties/{property_id}`
*   **Method**: `GET`
*   **Path Variable**: `property_id` (integer) - Unique database key for a property listing.

---

## 🎨 Main Application Features

1.  **City Dropdown Selector**: Quickly switch between major metropolises (Bangalore, Mumbai, Chennai, and Hyderabad) directly from the dropdown selector inside the [FilterBar.jsx](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/frontend/src/components/FilterBar.jsx).
2.  **Granular Filter System**: Refine search fields through the [FilterBar.jsx](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/frontend/src/components/FilterBar.jsx) to target specific cities, property styles, types (buy/rent), pricing constraints (both Min and Max Budget), and BHK options.
3.  **Real-time Keyword Searching**: Enter full text search queries on the fly to inspect property summaries, titles, localities, or amenity descriptions.
4.  **Responsive Layout**: Full design compatibility with mobile devices, tablets, and large screens, with a premium full-width Hero Header.
5.  **Interactive Detail Modal**: Open an overlay showing the agent's phone, email, details, and map attributes in [PropertyModal.jsx](file:///c:/Users/rohit/.gemini/antigravity/scratch/property-search-app/frontend/src/components/PropertyModal.jsx).
