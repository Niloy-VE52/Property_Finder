# Deploying MagicProperty Elite on Render

This guide outlines the steps to deploy the full-stack MagicProperty Elite application (FastAPI backend + React frontend) on [Render](https://render.com/).

Since Render handles backend Web Services and frontend Static Sites seamlessly, we will deploy this project as two separate services linked together.

## 🛠️ Prerequisites
1. A GitHub repository with your code pushed to the `main` branch.
2. A free account on [Render](https://render.com/).
3. Your `OPENAI_API_KEY`.

---

## Part 1: Deploying the Backend (FastAPI)

We will deploy the backend as a **Web Service** on Render.

1. Log in to your Render dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account (if you haven't already) and select the `Property_Finder` repository.
4. Fill in the following details for your new Web Service:
   - **Name**: `magicproperty-backend` (or similar)
   - **Root Directory**: `backend` *(Important: this tells Render where your Python app lives)*
   - **Environment**: `Python 3`
   - **Region**: Select the region closest to your target audience.
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   Scroll down to the Advanced section and add the following Environment Variable:
   - `OPENAI_API_KEY`: Paste your actual OpenAI API key.
6. Select the **Free** instance type (or a paid tier if you expect higher traffic).
7. Click **Create Web Service**.

Wait for the deployment to finish. Once it's live, copy the **backend URL** (e.g., `https://magicproperty-backend.onrender.com`). You will need this for the frontend deployment.

---

## Part 2: Deploying the Frontend (React + Vite)

We will deploy the frontend as a **Static Site** on Render. This is completely free and optimized for React apps.

1. Go back to your Render dashboard.
2. Click **New +** and select **Static Site**.
3. Connect and select the same `Property_Finder` repository.
4. Fill in the following details for your new Static Site:
   - **Name**: `magicproperty-frontend` (or similar)
   - **Root Directory**: `frontend` *(Important!)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` *(This is where Vite outputs the built files)*
5. **Environment Variables**:
   Expand the Advanced section and add the API URL pointing to your backend so the frontend knows where to make requests.
   - `VITE_API_BASE_URL`: Paste the backend URL you copied in Part 1, followed by `/api`. 
     *(Example: `https://magicproperty-backend.onrender.com/api`)*
6. Click **Create Static Site**.

Wait a few minutes for the build to complete. Render will provide a live URL for your frontend (e.g., `https://magicproperty-frontend.onrender.com`).

---

## 🚀 That's It!

You can now click on your frontend URL provided by Render, and you should see MagicProperty Elite running live!

### Troubleshooting

- **API calls failing/CORS errors**: 
  The FastAPI backend is already configured with a permissive CORS policy (`allow_origins=["*"]`). If you see CORS errors, ensure that your `VITE_API_BASE_URL` in the frontend does not have a trailing slash, and that the backend URL is fully correct (must start with `https://`).
- **Database issues on Render**: 
  SQLite works on Render's free tier, but because the disk is ephemeral on free Web Services, any changes made to the database (if you add write endpoints later) will be reset when the server spins down. Since this app only reads from the pre-seeded SQLite database for now, it works perfectly!
