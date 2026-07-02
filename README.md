# MagicProperty Elite - Indian Property Search App

![MagicProperty Elite](https://img.shields.io/badge/Status-Active-brightgreen)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

MagicProperty Elite is a premium, full-stack real estate property search application tailored for discerning buyers and renters in India's leading metro cities (Bangalore, Mumbai, Chennai, and Hyderabad). It features a modern Glassmorphism UI and a powerful AI-driven conversational assistant to help users find their perfect home.

## 🌟 Features

- **Advanced Property Search**: Filter properties by city, purpose (buy/rent), property type (flat/house), BHK, budget, and custom keywords.
- **AI Conversational Assistant**: A multi-turn, AI-powered chat assistant that acts as a virtual property consultant. It understands user requirements, answers real-estate queries, and automatically searches the database to suggest matching properties inline.
- **Premium User Interface**: Modern aesthetics utilizing glassmorphism, subtle animations, responsive grid layouts, and curated color palettes.
- **Detailed Property Views**: View comprehensive property details including amenities, agent contact info, and high-quality images.

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling and animations
- **Lucide React** for beautiful, consistent iconography
- **Vanilla CSS** for custom glassmorphism effects and keyframe animations

### Backend
- **FastAPI** (Python) for a lightning-fast backend API
- **SQLite & SQLAlchemy** for database management and ORM
- **OpenAI API** (`gpt-4o-mini`) for the conversational AI property assistant

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- OpenAI API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables:
   Create a `.env` file in the `backend` directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
5. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(On first run, the SQLite database will be automatically seeded with mock property data).*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```
MagicProperty-Elite---Indian-Property-Search-App/
├── backend/
│   ├── chat.py             # AI conversational assistant logic & endpoints
│   ├── assistant.py        # One-shot AI search utility
│   ├── database.py         # DB connection & seeding logic
│   ├── main.py             # FastAPI entry point & API routes
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic validation schemas
│   └── .env                # Environment variables (API Keys)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx       # Floating AI Chat UI
│   │   │   ├── AssistantPanel.jsx  # AI Search Panel
│   │   │   ├── PropertyCard.jsx    # Property listing card
│   │   │   ├── PropertyModal.jsx   # Detailed property view
│   │   │   ├── FilterBar.jsx       # Search & filters
│   │   │   └── Navbar.jsx          # Application header
│   │   ├── App.jsx         # Main application component
│   │   ├── index.css       # Global styles & animations
│   │   └── main.jsx        # React DOM entry point
│   ├── tailwind.config.js  # Tailwind theme configuration
│   └── package.json        # Frontend dependencies
└── README.md
```

## 📝 Disclaimer

This is a mock real estate portal built for demonstration and portfolio purposes. All property details, pricing, pictures, and agent information are simulated.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
